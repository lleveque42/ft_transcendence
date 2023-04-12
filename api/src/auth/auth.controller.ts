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
import { SignupDto, SigninDto, getAuthToken42Dto } from "./dto";
import { RtGuard } from "./guards/rt.guard";
import { GetCurrentUser } from "../common/decorators";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

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

	@UseGuards(RtGuard)
	@Post("logout")
	@HttpCode(HttpStatus.NO_CONTENT)
	logout(@Res({ passthrough: true }) res: Response): void {
		this.authService.logout(res);
	}

	// add decorator to have req.headers ?
	@UseGuards(RtGuard)
	@Get("refresh")
	async refresh(
		@GetCurrentUser() user: any,
		@Req() req: Request,
	): Promise<{ access_token: string }> {
		// const header = req?.get("authorization")?.replace("Bearer", "").trim();
		// const test = await this.authService.test(header, user);
		// console.log("TEST:", test);

		const access_token = await this.authService.signAccessToken("a", "a", "a");
		return { access_token: access_token.access_token };
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
