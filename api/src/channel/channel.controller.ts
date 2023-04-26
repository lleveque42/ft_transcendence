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
import { ChannelService } from "./channel.service";
import { AtGuard } from "../auth/guards";
import { GetCurrentUser } from "../common/decorators";
import { ChannelDto } from "./../auth/dto/channel.dto";
import { Channel } from "@prisma/client";

@Controller("channels")
export class ChannelController {
	constructor(private channelService: ChannelService) {}

	@Delete("temporary_dropdb")
	@HttpCode(HttpStatus.GONE)
	async dropdb() {
		await this.channelService.dropdb();
	}

	@UseGuards(AtGuard)
	@Get("test")
	test(@GetCurrentUser("sub") userName: string): string {
		return userName;
	}
	@Post("create_channel")
	async createChannel(
		@Body() body,
		@Res({ passthrough: true }) res: Response,
	): Promise<Channel> {
		try {
			console.log("Title : " + body.title);

			const channel = await this.channelService.createChannel(
				{
					title: body.title,
					type: body.type,
				},
				body.username,
			);
			console.log("New chan : " + channel.title);
			return channel;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}
}
