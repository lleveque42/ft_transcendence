import { Controller, Delete, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
	constructor(private userService: UserService) {}

	@Delete("temporary_dropdb")
	@HttpCode(HttpStatus.GONE)
	async dropdb() {
		await this.userService.dropdb();
	}
}
