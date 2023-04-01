import { Controller, Post, Get, Body, Res, Param } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { SignupDto, SigninDto, getAuthToken42Dto } from "./dto";

// interface userInter {
// 	login: string;
// 	email: string;
// 	first_name: string;
// 	last_name: string;
// }

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("signup")
	signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response) {
		return this.authService.signup(dto, res);
	}

	@Post("login")
	login(@Body() dto: SigninDto, @Res({ passthrough: true }) res: Response) {
		return this.authService.login(dto, res);
	}

	@Get("token42/:code")
	async getAuthToken42(@Param() params: getAuthToken42Dto) {
		// Don't need to return string because we stroe in cookies from the back ?
		console.log("------------------- GET token 42 -------------------");
		try {
			const token42 = await this.authService.getAuthToken42(params.code);
			console.log("TOKEN 42: ", token42);
			const newUser = await this.authService.userInfo42(token42);
			// const {}
			// Need to find a way keep only wanted infos
			console.log("NEWUSER INFO : ", test);

			return newUser;
		} catch (e) {
			console.error(e);
		}
		return "";
	}
}
