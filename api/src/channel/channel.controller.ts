import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
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
import { GetUserList } from "../common/types";
import {
	AddInviteDto,
	AdminDto,
	BanOrKickDto,
	EditChannelDto,
	JoinDto,
	LeaveChannelDto,
	MuteDto,
	NewChannelDto,
	RetrieveInviteListDto,
	SecretDto,
	createDmDto,
	titleDmDto,
	titleDto,
	userNameDto,
} from "./dto/channel.dto";
import { ChannelModel } from "./classes/entities";

@Controller("channels")
export class ChannelController {
	constructor(
		private channelService: ChannelService,
		private userService: UserService,
	) {}

	@UseGuards(AtGuard)
	@Get("/join")
	async getPublicChannelsToJoin(
		@GetCurrentUser("sub") userName: string,
	): Promise<{ id: number; title: string }[]> {
		try {
			const user = await this.userService.getUserByUserName(userName);
			if (!user) {
				throw new ForbiddenException("User doesn't exist");
			}
			const channels = await this.channelService.getPublicChannelsToJoin(
				user.id,
			);
			return channels;
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}

	@UseGuards(AtGuard)
	@Get("/:username")
	async getUserChans(
		@Param() params: userNameDto,
	): Promise<{ id: number; title: string }[]> {
		try {
			const channels = await this.channelService.getUsersChannels(
				params.username,
			);
			return channels;
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}

	@UseGuards(AtGuard)
	@Get("/dm/:username")
	async getUserDirectMessages(
		@Param() params: userNameDto,
	): Promise<Channel[]> {
		try {
			const channels = await this.channelService.getUserDirectMessages(
				params.username,
			);
			return channels;
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}

	@UseGuards(AtGuard)
	@Get("/chan/:title")
	async getChanMessages(
		@GetCurrentUser("sub") userName: string,
		@Param() params: titleDto,
	): Promise<Message[] | null> {
		try {
			const msgs = await this.channelService.getChanMessages(
				userName,
				params.title,
			);
			return msgs;
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}

	@UseGuards(AtGuard)
	@Get("/edit/:title")
	async getChanInfos(@Param() params: titleDto): Promise<Channel> {
		try {
			const chan = await this.channelService.getChannelByTitle(params.title);
			return chan;
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}

	@UseGuards(AtGuard)
	@Get("/dm/chan/:title")
	async getDMsMessages(
		@GetCurrentUser("sub") userName: string,
		@Param() params: titleDto,
	): Promise<{
		msgs: (Message & {
			author: { id: number; userName: string };
			channel: Channel;
		})[];
		otherUser: { id: number; userName: string };
	}> {
		try {
			return await this.channelService.getDMsMessages(userName, params.title);
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}

	@UseGuards(AtGuard)
	@Get("/users_list/retrieve")
	async getUsersList(
		@GetCurrentUser("sub") userName: string,
	): Promise<GetUserList[]> {
		try {
			return await this.userService.getJoignableUsers(userName);
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}

	@UseGuards(AtGuard)
	@Post("create_channel")
	async createChannel(
		@Body() body: NewChannelDto,
		@Res({ passthrough: true }) res: Response,
	) {
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
			res.status(201);
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}

	@UseGuards(AtGuard)
	@Post("edit_channel")
	async editChannel(
		@Body() body: EditChannelDto,
		@Res({ passthrough: true }) res: Response,
	) {
		try {
			await this.channelService.updateChannel(
				{
					title: body.title,
					type: body.type,
					mode: body.mode,
					password: body.password,
				},
				body.oldTitle,
			);
			res.status(201);
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}

	@UseGuards(AtGuard)
	@Post("leave")
	async leaveFromChannel(
		@Body() body: LeaveChannelDto,
		@Res({ passthrough: true }) res: Response,
	) {
		try {
			await this.channelService.leaveFromChannel(
				body.userName,
				body.id,
				body.room,
			);
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}

	@UseGuards(AtGuard)
	@Post("kick")
	async kickFromChannel(
		@Body() body: BanOrKickDto,
		@Res({ passthrough: true }) res: Response,
	) {
		try {
			await this.channelService.kickFromChannel(body.userName, body.id);
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}

	@UseGuards(AtGuard)
	@Post("ban")
	async banFromChannel(
		@Body() body: BanOrKickDto,
		@Res({ passthrough: true }) res: Response,
	) {
		try {
			await this.channelService.banFromChannel(body.userName, body.id);
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}

	@UseGuards(AtGuard)
	@Post("mute")
	async muteInChannel(
		@Body() body: MuteDto,
		@Res({ passthrough: true }) res: Response,
	) {
		try {
			const chan = await this.channelService.muteInChannel(
				body.chanId,
				body.userId,
				body.mutedEnd,
			);
			return chan;
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}

	@UseGuards(AtGuard)
	@Post("admin")
	async adminOfChannel(
		@Body() body: AdminDto,
		@Res({ passthrough: true }) res: Response,
	) {
		try {
			const chan = await this.channelService.adminOfChannel(
				body.userName,
				body.id,
			);
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}

	@UseGuards(AtGuard)
	@Post("create_join_dm")
	async createDM(@Body() body: createDmDto): Promise<void> {
		try {
			await this.channelService.createDM(
				{
					title: body.title,
					type: body.type,
					mode: body.mode,
					password: body.password,
				},
				body.id1,
				body.id2,
			);
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@UseGuards(AtGuard)
	@Delete("delDm")
	async FdelDm(
		@GetCurrentUser("sub") userName: string,
		@Body() body: titleDmDto,
	) {
		try {
			await this.channelService.deleteDm(userName, body.title);
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@Post("join_channel")
	async joinChannel(
		@Body() body: JoinDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		try {
			const channel = await this.channelService.joinPublicChannel(
				body.userId,
				body.channelId,
			);
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}

	@UseGuards(AtGuard)
	@Post("/retrieve_invite_list")
	async retrieveInviteChannel(
		@Body() body: RetrieveInviteListDto,
		@GetCurrentUser("sub") userName: string,
		@Res({ passthrough: true }) res: Response,
	): Promise<{ id: number; userName: string }[]> {
		try {
			const users = await this.channelService.getInviteList(
				body.title,
				userName,
			);
			return users;
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.NOT_FOUND);
		}
	}

	@UseGuards(AtGuard)
	@Post("/invite")
	async addInviteChannel(
		@Body() body: AddInviteDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		try {
			const users = await this.channelService.addToChannel(
				body.title,
				body.userId,
			);
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.NOT_FOUND);
		}
	}

	@UseGuards(AtGuard)
	@Post("secret")
	async checkSecret(
		@Body() body: SecretDto,
		@GetCurrentUser("sub") userName: string,
		@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		try {
			await this.channelService.checkSecret(body.chanId, body.secret, userName);
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.FORBIDDEN);
		}
	}
}
