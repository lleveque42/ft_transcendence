import { Controller, Post, Get, Body, Req, Res, Param } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { SignupDto, SigninDto, login42Dto } from "./dto";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("signup")
	signup(
		@Body() dto: SignupDto,
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.signup(dto, req, res);
	}

	@Post("login")
	login(@Body() dto: SigninDto, @Res({ passthrough: true }) res: Response) {
		return this.authService.login(dto, res);
	}

	@Get("login42/:code")
	loginFortyTwo(@Param() params: login42Dto) {
		console.log(params.code);
		// Use Service and pass code as string param,
		
		// return this.authService.loginFortyTwo(dto, res);
	}
}
