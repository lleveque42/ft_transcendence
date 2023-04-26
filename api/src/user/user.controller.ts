import {
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Res,
	UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { GetCurrentUser } from "../common/decorators";
import { AtGuard } from "../auth/guards";
import { UserLoginDto } from "../auth/dto/channel.dto";
import { User } from "@prisma/client";
import { UserInfo } from "os";

@Controller("user")
export class UserController {
	constructor(private userService: UserService) {}

	@Delete("temporary_dropdb")
	@HttpCode(HttpStatus.GONE)
	async dropdb() {
		await this.userService.dropdb();
	}

	@UseGuards(AtGuard)
	@Get("test")
	test(@GetCurrentUser("sub") userName: string): string {
		return userName;
	}

	@Get("/:login")
	async login(
		@Param() params: UserLoginDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<User> {
		try {
			const user = await this.userService.getUserByUserName(params.login);
			console.log("User : " + user.userName);
			return user;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	// @Get("/:login")
	// async login(
	// 	@Param() params: UserLoginDto,
	// 	@Res({ passthrough: true }) res: Response,
	// ): Promise<User> {
	// 	try {
	// 		const user = await this.userService.getUserByEmail(params.login);
	// 		console.log("User " + user.email);
	// 		const userInfo = {
	// 			userName: user.userName,
	// 			email: user.email,
	// 			firstName: user.firstName,
	// 			lastName: user.lastName,
	// 			id: user.id,
	// 			socket: user.socket,
	// 			avatar: user.avatar,
	// 			createdAt: user.createdAt,
	// 			updatedAt: user.updatedAt,
	// 			hash: user.hash,
	// 		};
	// 		console.log("User" + userInfo.email);
	// 		return userInfo;
	// 	} catch (e) {
	// 		throw new HttpException(e.message, e.status);
	// 	}
	// }
}
