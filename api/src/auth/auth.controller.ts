import { Controller, Post, Get, Body, Res, Param } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { SignupDto, SigninDto, getAuthToken42Dto } from "./dto";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("signup") // To del at the end
	signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response) {
		return this.authService.signup(dto, res);
	}

	@Post("login")
	login(@Body() dto: SigninDto, @Res({ passthrough: true }) res: Response) {
		return this.authService.login(dto, res);
	}

	@Get("token42/:code") // Rename callback42
	async getAuthToken42(
		@Param() params: getAuthToken42Dto,
		@Res({ passthrough: true }) res: Response,
	) {
		// Need to store token42 ??
		console.log("------------------- GET token 42 -------------------");
		try {
			const token42 = await this.authService.getAuthToken42(params.code);
			const newUser42 = await this.authService.userInfo42(token42);
			console.log("NEWUSER INFO : ", newUser42);
			this.authService.manageNewAuth(newUser42, res);
		} catch (e) {
			console.error(e.message);
		}
	}
}
