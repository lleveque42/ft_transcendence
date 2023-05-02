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
	Param,
	ParseFilePipe,
	Patch,
	StreamableFile,
	UploadedFile,
	UseFilters,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { GetCurrentUser } from "../common/decorators";
import { AtGuard } from "../auth/guards";
import { UserNameDto, updateUserNameDto } from "./dto";
import { tfaVerificationCode } from "./dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { NotImageExeptionFilter } from "../common/filters/notImageExeptionFilter.filter";
import { UserInfosType } from "./types";

const storageOptions = {
	storage: diskStorage({
		destination: "./files/avatars",
		filename: (req, file, cb) => {
			const randomName = Array(16)
				.fill(null)
				.map(() => Math.round(Math.random() * 16).toString(16))
				.join("");
			return cb(null, `${randomName}${extname(file.originalname)}`);
		},
	}),
};

const parseFileOptions = new ParseFilePipe({
	validators: [
		new MaxFileSizeValidator({ maxSize: 10000000 }),
		new FileTypeValidator({
			fileType: ".(png|jpeg|jpg)",
		}),
	],
	errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
});

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
	@UseFilters(NotImageExeptionFilter)
	async updateAvatar(
		@GetCurrentUser("sub") userName: string,
		@UploadedFile(parseFileOptions)
		file: Express.Multer.File,
	): Promise<void> {
		await this.userService.uploadAvatar(userName, file);
	}

	@UseGuards(AtGuard)
	@Get("avatar/:username")
	async getUserAvatar(
		@Param() params: UserNameDto,
	): Promise<StreamableFile | String> {
		const user = await this.userService.getUserByUserName(params.username);
		if (!user) throw new HttpException("Error get user avatar", 403);
		return await this.userService.getAvatar(user);
	}

	@UseGuards(AtGuard)
	@Get("infos/:username")
	async getUserInfos(
		@Param() params: UserNameDto,
	): Promise<UserInfosType> {
		const user = await this.userService.getUserByUserName(params.username);
		if (!user) throw new HttpException("Error get user avatar", 404);
		return {
			userName: user.userName,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email
		};
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
