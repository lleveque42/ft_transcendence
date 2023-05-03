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
import { Channel, Message } from "@prisma/client";

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

	@Get("")
	async getAll(): // @Param() params: UserLoginDto,
	// @Res({ passthrough: true }) res: Response,
	Promise<Channel[]> {
		try {
			const channels = await this.channelService.getAllChannels();
			return channels;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@Get("/:username")
	async getUserChans(@Param("username") username: string): Promise<Channel[]> {
		try {
			console.log("Enter getUserChans");
			const channels = await this.channelService.getUsersChannels(username);
			return channels;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@Get("/:username")
	async getUserDirectMessages(
		@Param("username") username: string,
	): Promise<Channel[]> {
		try {
			console.log("Enter getUserDirectMessages");
			const channels = await this.channelService.getUsersChannels(username);
			return channels;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@Get("/chan/:title")
	async getChanMessages(@Param("title") title: string): Promise<Message[]> {
		try {
			console.log("Enter getChanMEssages");

			const msgs = await this.channelService.getChanMessages(title);
			return msgs;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@Post("create_channel")
	async createChannel(
		@Body() body,
		@Res({ passthrough: true }) res: Response,
	): Promise<Channel> {
		try {
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
