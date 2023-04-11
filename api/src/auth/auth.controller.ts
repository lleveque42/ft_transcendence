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
	Req,
	UseGuards,
} from "@nestjs/common";
import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { SignupDto, SigninDto, getAuthToken42Dto } from "./dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("signup") // To del at the end
	async signup(
		@Body() dto: SignupDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<string> {
		try {
			await this.authService.signup(dto, res);
		} catch (e) {
			// handle user email already exist
			throw new HttpException(e.message, e.status);
		}
		return "";
	}

	@Post("login") // To del at the end
	async login(
		@Body() dto: SigninDto,
		@Res({ passthrough: true }) res: Response,
	) {
		try {
			await this.authService.login(dto, res);
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@Post("logout")
	@HttpCode(HttpStatus.NO_CONTENT)
	logout(@Res({ passthrough: true }) res: Response) {
		this.authService.logout(res);
	}

	@UseGuards(AuthGuard("jwt"))
	@Get("refresh") // Post or get ?
	refresh(@Req() req: Request): {} {
		console.log("Refresh token api side");

		const cookie = req.cookies["_jwt"];
		const test = "Coucou lol";
		return { cookie, test };
	}

	@Get("callback42/:code")
	async getAuthToken42(
		@Param() params: getAuthToken42Dto,
		@Res({ passthrough: true }) res: Response,
	) {
		try {
			const token42 = await this.authService.getAuthToken42(params.code);
			const newUser42 = await this.authService.userInfo42(token42);
			await this.authService.manageNewAuth42(newUser42, res);
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}
}
