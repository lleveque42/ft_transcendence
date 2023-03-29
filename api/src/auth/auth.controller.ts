import { Controller, Post, Body, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { SignupDto, SigninDto } from "./dto";

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

	@Post("signin")
	signin(@Body() dto: SigninDto) {
		return this.authService.signin(dto);
	}
}
