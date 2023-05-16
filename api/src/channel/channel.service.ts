import { ForbiddenException, HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";
import { Channel, Prisma } from "@prisma/client";
import * as argon2 from "argon2";
import { OnlineUsers } from "../classes/OnlineUsers";

@Injectable()
export class ChannelService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService,
	) {}

	users: OnlineUsers = new OnlineUsers();

	async createChannel(newChannel: Prisma.ChannelCreateInput, userName: string) {
		const user = await this.userService.getUserByUserName(userName);
		let hash: string = null;
		if (newChannel.password && newChannel.password !== "") {
			hash = await argon2.hash(newChannel.password);
		}
		try {
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
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				throw new ForbiddenException("Duplicate key value");
			}
		}
	}

	async updateChannel(newChannel: Prisma.ChannelCreateInput, oldtitle: string) {
		let hash: string = null;
		if (newChannel.password && newChannel.password !== "") {
			hash = await argon2.hash(newChannel.password);
		}
		try {
			const chan = await this.prisma.channel.update({
				where: {
					title: oldtitle,
				},
				data: {
					title: newChannel.title,
					password: hash,
					type: newChannel.type,
					mode: newChannel.mode,
				},
			});
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				throw new ForbiddenException("Duplicate key value");
			}
		}
	}

	async createDM(
		newChannel: Prisma.ChannelCreateInput,
		userId1: number,
		userId2: number,
	) {
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
				ownerId: userId1,
				operators: {
					connect: { id: userId1 },
				},
				members: {
					connect: { id: userId1 },
				},
			},
		});
		const updatedChannel = await this.prisma.channel.update({
			where: { id: chan.id },
			data: {
				operators: {
					connect: { id: userId2 },
				},
				members: {
					connect: { id: userId2 },
				},
			},
		});
		return updatedChannel;
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
			include: {
				members: {
					select: {
						id: true,
						userName: true,
					},
				},
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

	async getUsersDMs(username) {
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
				type: "DM",
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
				members: {
					select: {
						id: true,
						userName: true,
					},
				},
				messages: true,
			},
			where: {
				members: {
					some: {
						id: user.id,
					},
				},
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
	async getDMsMessages(title) {
		const chan = await this.prisma.channel.findUnique({
			where: {
				title: title,
			},
		});
		if (chan) {
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
		} else {
			return null;
		}
	}
	async dropdb() {
		await this.prisma.channel.deleteMany({});
	}
}
