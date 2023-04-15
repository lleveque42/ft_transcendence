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

	// NEED TO TYPE PROPELLY !!
	@UseGuards(RtGuard)
	@Get("refresh")
	async refresh(
		@GetCurrentUser("email") userEmail: string,
		@Req() req: Request,
	): Promise<{ accessToken: string; userData: any }> {
		const accessToken = await this.authService.newTokens(userEmail);
		const user = await this.userService.getUserByEmail(userEmail);
		const userData = {
			userName: user.userName,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
		};

		return { accessToken: accessToken.access_token, userData };
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
}
