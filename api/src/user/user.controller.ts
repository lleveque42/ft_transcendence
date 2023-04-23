import {
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	MaxFileSizeValidator,
	ParseFilePipe,
	Patch,
	StreamableFile,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { GetCurrentUser } from "../common/decorators";
import { AtGuard } from "../auth/guards";
import { updateUserNameDto } from "./dto";
import { tfaVerificationCode } from "./dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { createReadStream } from "fs";

export const storageOptions = {
	storage: diskStorage({
		destination: "./files/avatars",
		filename: (req, file, cb) => {
			const randomName = Array(32)
				.fill(null)
				.map(() => Math.round(Math.random() * 16).toString(16))
				.join("");
			return cb(null, `${randomName}${extname(file.originalname)}`);
		},
	}),
};

@Controller("user")
export class UserController {
	constructor(private userService: UserService) {}

	@Delete("temporary_dropdb") // To del
	@HttpCode(HttpStatus.GONE)
	async dropdb(): Promise<void> {
		await this.userService.dropdb();
	}

	@UseGuards(AtGuard) // To del
	@Get("test")
	test(@GetCurrentUser("sub") userName: string): string {
		return userName;
	}

	@UseGuards(AtGuard)
	@Patch("settings")
	async updateSettings(
		@GetCurrentUser("sub") userName: string,
		@Body() dto: updateUserNameDto,
	): Promise<void> {
		try {
			await this.userService.updateUserName(userName, dto.newUserName);
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@UseGuards(AtGuard)
	@Patch("upload/avatar")
	@UseInterceptors(FileInterceptor("file", storageOptions))
	async updateAvatar(
		@GetCurrentUser("sub") userName: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1000000 }),
					new FileTypeValidator({
						fileType: ".(png|jpeg|jpg)",
					}),
				],
			}),
		)
		file: Express.Multer.File,
	): Promise<void> {
		await this.userService.uploadAvatar(userName, file);
	}

	@UseGuards(AtGuard)
	@Get("avatar")
	async getUserAvatar(
		@GetCurrentUser("sub") userName: string,
	): Promise<StreamableFile | String> {
		const user = await this.userService.getUserByUserName(userName);
		if (!user) throw new HttpException("Error get user avatar", 403);
		if (user.avatar.includes("/files/avatars/")) {
			return new StreamableFile(createReadStream(user.avatar));
		} else if (user.avatar.includes("https://cdn.intra.42.fr/users/")) {
			return user.avatar;
		} else {
			throw new HttpException(
				"Can't provide avatar",
				HttpStatus.NO_CONTENT,
			);
		}
	}

	@UseGuards(AtGuard)
	@Get("/tfa/generate")
	async generateTfaQrCode(
		@GetCurrentUser("sub") userName: string,
	): Promise<void> {
		try {
			const otpAuthUrl = await this.userService.generateTfaSecret(userName);
			return this.userService.generateQrCodeDataUrl(otpAuthUrl);
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@UseGuards(AtGuard)
	@Patch("/tfa/enable")
	async enableTfa(
		@GetCurrentUser("sub") userName: string,
		@Body() dto: tfaVerificationCode,
	): Promise<void> {
		const isCodeValid = await this.userService.isTfaCodeValid(
			userName,
			dto.code,
		);
		if (!isCodeValid)
			throw new HttpException(
				"Invalid authentication code",
				HttpStatus.UNAUTHORIZED,
			);
		await this.userService.toggleTfa(userName, true);
	}

	@UseGuards(AtGuard)
	@Patch("/tfa/disable")
	async disableTfa(@GetCurrentUser("sub") userName: string): Promise<void> {
		try {
			await this.userService.removeTfa(userName);
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}
}
