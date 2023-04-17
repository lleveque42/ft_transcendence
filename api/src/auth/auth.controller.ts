import {
	Controller,
	Post,
	Get,
	Body,
	Res,
	Param,
	HttpException,
	HttpCode,
	HttpStatus,
	UseGuards,
	Req,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { SignupDto, SigninDto, getAuthToken42Dto } from "./dto";
import { GetCurrentUser } from "../common/decorators";
import { AtGuard, RtGuard } from "./guards";
import { UserDataRefresh } from "../common/types";

@Controller("auth")
export class AuthController {
	constructor(
		private authService: AuthService,
		private readonly userService: UserService,
	) {}

	@Post("signup") // To del at the end
	async signup(
		@Body() dto: SignupDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		try {
			await this.authService.signup(dto, res);
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@Post("login") // To del at the end
	async login(
		@Body() dto: SigninDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		try {
			await this.authService.login(dto, res);
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@UseGuards(AtGuard)
	@Post("logout")
	@HttpCode(HttpStatus.NO_CONTENT)
	logout(@Res({ passthrough: true }) res: Response): void {
		this.authService.logout(res);
	}

	@UseGuards(RtGuard)
	@Get("refresh")
	async refresh(
		@GetCurrentUser("email") userEmail: string,
	): Promise<{ accessToken: string; userData: UserDataRefresh }> {
		const accessToken = await this.authService.newTokens(userEmail);
		const user = await this.userService.getUserByEmail(userEmail);

		return {
			accessToken: accessToken.access_token,
			userData: {
				userName: user.userName,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				isTfaEnable: user.isTfaEnable
			},
		};
	}

	@Get("callback42/:code")
	async getAuthToken42(
		@Param() params: getAuthToken42Dto,
		@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		try {
			const token42 = await this.authService.getAuthToken42(params.code);
			const newUser42 = await this.authService.userInfo42(token42);
			await this.authService.manageNewAuth42(newUser42, res);
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@UseGuards(AtGuard)
	@Get("/tfa/generate")
	async generateTfaQrCode(@GetCurrentUser("sub") userName: string,) {
		console.log(userName);

		try {
			const otpAuthUrl = await this.authService.generateTfaSecret(userName);
			return await this.authService.generateQrCodeDataUrl(otpAuthUrl);
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

}
