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
import { UserService } from "./../user/user.service";
import { AtGuard } from "../auth/guards";
import { GetCurrentUser } from "../common/decorators";
import { Channel, Message, User } from "@prisma/client";
import { Response } from "express";

@Controller("channels")
export class ChannelController {
	constructor(
		private channelService: ChannelService,
		private userService: UserService,
	) {}

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

	@UseGuards(AtGuard)
	@Get("")
	async getPublicChannelsToJoin(
		@GetCurrentUser("sub") userName: string,
	): Promise<Channel[]> {
		try {
			const user = await this.userService.getUserByUserName(userName);
			console.log(user);

			const channels = await this.channelService.getPublicChannelsToJoin(
				user.id,
			);
			console.log(channels);

			return channels;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@Get("/:username")
	async getUserChans(@Param("username") username: string): Promise<Channel[]> {
		try {
			const channels = await this.channelService.getUsersChannels(username);
			return channels;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@Get("/dm/:username")
	async getUserDirectMessages(
		@Param("username") username: string,
	): Promise<Channel[]> {
		try {
			const channels = await this.channelService.getUserDirectMessages(
				username,
			);
			return channels;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@Get("/chan/:title")
	async getChanMessages(@Param("title") title: string): Promise<Message[]> {
		try {
			const msgs = await this.channelService.getChanMessages(title);
			return msgs;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@Get("/edit/:title")
	async getChanInfos(@Param("title") title: string): Promise<Channel> {
		try {
			const chan = await this.channelService.getChannelByTitle(title);
			return chan;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@Get("/dm/chan/:title")
	async getDMsMessages(@Param("title") title: string): Promise<Message[]> {
		try {
			const msgs = await this.channelService.getDMsMessages(title);
			return msgs;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@UseGuards(AtGuard)
	@Get("/users_list/:test")
	async getUsersList(
		@GetCurrentUser("sub") userName: string,
	): Promise<{ id: number; userName: string }[]> {
		try {
			const users = await this.userService.getJoignableUsers(userName);
			return users;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@Post("create_channel")
	async createChannel(@Body() body, @Res({ passthrough: true }) res: Response) {
		try {
			const chan = await this.channelService.createChannel(
				{
					title: body.title,
					type: body.type,
					mode: body.mode,
					password: body.password,
				},
				body.username,
			);
			res.json("OK");
		} catch (e) {
			res.json("Duplicate");
		}
	}

	@Post("create_join_dm")
	async createDM(
		@Body() body,
		@Res({ passthrough: true }) res: Response,
	): Promise<Channel> {
		try {
			const channel = await this.channelService.createDM(
				{
					title: body.title,
					type: body.type,
					mode: body.mode,
					password: body.password,
				},
				body.id1,
				body.id2,
			);
			return channel;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@Post("join_channel")
	async joinChannel(
		@Body() body,
		@Res({ passthrough: true }) res: Response,
	): Promise<Channel> {
		try {
			const channel = await this.channelService.joinPublicChannel(
				body.userId,
				body.channelId,
			);
			return channel;
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}
}
