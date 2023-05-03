import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ChannelDto } from "../auth/dto/channel.dto";
import { UserService } from "../user/user.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ChannelService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService,
	) {}

	async createChannel(newChannel: Prisma.ChannelCreateInput, userName: string) {
		const user = await this.userService.getUserByUserName(userName);
		const chan = await this.prisma.channel.create({
			data: {
				title: newChannel.title,
				password: "",
				type: newChannel.type,
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
				type: "Channel",
			},
		});
		return chans;
	}

	async getUserDirectMessages(username) {
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
				type: "DM",
			},
		});
		return chans;
	}

	async getChanMessages(title) {
		const chan = await this.prisma.channel.findUnique({
			where: {
				title: title,
			},
		});
		const chans = await this.prisma.message.findMany({
			include: {
				author: true,
				channel: true,
			},
			where: {
				channel: chan,
			},
		});
		return chans;
	}

	async dropdb() {
		await this.prisma.channel.deleteMany({});
	}
}
