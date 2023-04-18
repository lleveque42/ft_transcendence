import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Patch,
	UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { GetCurrentUser } from "../common/decorators";
import { AtGuard } from "../auth/guards";
import { updateUserNameDto } from "./dto";
import { qrCodeVerifDto } from "./dto";

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
		@Body() dto: qrCodeVerifDto,
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
