import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Patch,
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
	@Patch("avatar")
	@UseInterceptors(
		FileInterceptor("file", {
			storage: diskStorage({
				destination: "./avatars",
				filename: (req, file, cb) => {
					const randomName = Array(32)
						.fill(null)
						.map(() => Math.round(Math.random() * 16).toString(16))
						.join("");
					return cb(null, `${randomName}${extname(file.originalname)}`);
				},
			}),
		}),
	)
	async updateAvatar(
		@GetCurrentUser("sub") userName: string,
		@UploadedFile() file: Express.Multer.File,
	): Promise<void> {
		console.log("Avatar user: ", userName);
		const user = await this.userService.getUserByUserName(userName);
		await this.userService.testavatar(user, `http://localhost:3000/avatars/${file.filename}`);
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
