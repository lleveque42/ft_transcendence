import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ChannelDto } from "../auth/dto/channel.dto";
import { UserService } from "../user/user.service";
import { Channel, Prisma } from "@prisma/client";
import * as argon2 from "argon2";

@Injectable()
export class ChannelService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService,
	) {}

	async createChannel(newChannel: Prisma.ChannelCreateInput, userName: string) {
		const user = await this.userService.getUserByUserName(userName);
		let hash: string = null;
		if (newChannel.password && newChannel.password !== "") {
			hash = await argon2.hash(newChannel.password);
		}
		const chan = await this.prisma.channel.create({
			data: {
				title: newChannel.title,
				password: hash,
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

	async joinPublicChannel(userId: number, channelId: number) {
		const updatedChannel = await this.prisma.channel.update({
			where: { id: channelId },
			data: { members: { connect: { id: userId } } },
		});
		return updatedChannel;
	}

	async getChannelByTitle(title: any) {
		return await this.prisma.channel.findUnique({
			where: {
				title,
			},
		});
	}

	async getAllPublicChannels() {
		const chans = await this.prisma.channel.findMany({
			where: {
				mode: "Public",
			},
		});
		return chans;
	}

	async getPublicChannelsToJoin(userId: number): Promise<Channel[]> {
		const chans = await this.prisma.channel.findMany({
			where: {
				mode: "Public",
				NOT: {
					members: {
						some: {
							id: userId,
						},
					},
				},
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
				type: "Channel",
				members: {
					some: {
						id: user.id,
					},
				},
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
		const msgs = await this.prisma.message.findMany({
			include: {
				author: true,
				channel: true,
			},
			where: {
				channel: chan,
			},
		});
		return msgs;
	}

	async dropdb() {
		await this.prisma.channel.deleteMany({});
	}
}
