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

	@UseGuards(AtGuard)
	@Patch("settings")
	async updateSettings(
		@GetCurrentUser("sub") userName: string,
		@Body() dto: updateUserNameDto,
	) {
		try {
			await this.userService.updateUserName(userName, dto.newUserName)
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}
}
