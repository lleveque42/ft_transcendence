import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Res,
	UseGuards,
} from "@nestjs/common";
import { MessageService } from "./message.service";
import { AtGuard } from "../auth/guards";
import { GetCurrentUser } from "../common/decorators";
import { Message } from "@prisma/client";

@Controller("message")
export class MessageController {
	constructor(private messageService: MessageService) {}

	@Delete("temporary_dropdb")
	@HttpCode(HttpStatus.GONE)
	async dropdb() {
		await this.messageService.dropdb();
	}

	@UseGuards(AtGuard)
	@Get("test")
	test(@GetCurrentUser("sub") userName: string): string {
		return userName;
	}

	@Post("")
	async createNewMessage(
		@Body() body,
		@Res({ passthrough: true }) res: Response,
	): Promise<Message> {
		try {
			const msg = await this.messageService.createNewNessage(
				{
					content: body.content,
				},
				body.username,
				body.chantitle,
			);
			return msg;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}
}
