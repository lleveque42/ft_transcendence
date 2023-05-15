import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";
import { ChannelService } from "../channel/channel.service";
import { Message, Prisma } from "@prisma/client";

@Injectable()
export class MessageService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService,
		private channelService: ChannelService,
	) {}

	async createNewNessage(
		newMessage: Prisma.MessageCreateInput,
		userName: string,
		chanTitle: string,
	) {
		const user = await this.userService.getUserByUserName(userName);
		const chan = await this.channelService.getChannelByTitle(chanTitle);
		const msg: Message = await this.prisma.message.create({
			data: {
				content: newMessage.content,
				authorId: user.id,
				channelId: chan.id,
			},
			include: {
				author: {
					select: {
						userName: true,
					},
				},
			},
		});
		return msg;
	}

	async deleteMessageById(id: number) {
		const msg = await this.prisma.message.delete({
			where: {
				id,
			},
		});
		return msg;
	}

	async createChannel(newChannel: Prisma.ChannelCreateInput, userName: string) {
		const user = await this.userService.getUserByUserName(userName);
		const chan = await this.prisma.channel.create({
			data: {
				title: newChannel.title,
				password: "",
				type: newChannel.type,
				mode: newChannel.mode,
				ownerId: user.id,
				operators: {
					connect: { id: user.id },
				},
				members: {
					connect: { id: user.id },
				},
			},
		});
		return chan;
	}

	async getChannelByTitle(title: any) {
		return await this.prisma.channel.findUnique({
			where: {
				title,
			},
		});
	}

	async getAllChannels() {
		const chans = await this.prisma.channel.findMany({
			include: {
				owner: true,
				members: true,
				operators: true,
				messages: true,
			},
		});
		return chans;
	}

	async getUsersChannels(username) {
		const user = await this.prisma.user.findUnique({
			where: {
				userName: username,
			},
		});
		const chans = await this.prisma.channel.findMany({
			include: {
				owner: true,
				members: true,
				operators: true,
				messages: true,
			},
			where: {
				owner: user,
			},
		});
		return chans;
	}

	async dropdb() {
		await this.prisma.message.deleteMany({});
	}
}
