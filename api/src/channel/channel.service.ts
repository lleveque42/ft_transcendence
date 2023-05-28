import {
	ForbiddenException,
	HttpException,
	HttpStatus,
	Injectable,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";
import { Channel, Muted, Prisma, User } from "@prisma/client";
import * as argon2 from "argon2";
import { OnlineUsers } from "../classes/OnlineUsers";
import { ChannelModel } from "./classes/entities";

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
			if (!hash) {
				throw new ForbiddenException("Error in Argon side");
			}
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
		if (!chan) {
			throw new ForbiddenException("Error while updating channel");
		}
	}

	async updateChannel(newChannel: Prisma.ChannelCreateInput, oldtitle: string) {
		let hash: string = null;
		if (newChannel.password && newChannel.password !== "") {
			hash = await argon2.hash(newChannel.password);
			if (!hash) {
				throw new ForbiddenException("Error in Argon side");
			}
		}
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
		if (!chan) {
			throw new ForbiddenException("Error while updating channel");
		}
	}

	async leaveFromChannel(userName: string, userId: number, chanTitle) {
		try {
			const chan = await this.prisma.channel.update({
				where: {
					title: chanTitle,
				},
				data: {
					members: {
						disconnect: {
							userName: userName,
						},
					},
					operators: {
						disconnect: {
							userName: userName,
						},
					},
				},
			});
			if (!chan) {
				throw new ForbiddenException("Can't update the channel");
			}
		} catch (error) {
			throw new ForbiddenException("Error while leaving");
		}
	}

	async kickFromChannel(userName: string, id: number) {
		try {
			const user = await this.userService.getUserByUserName(userName);
			if (!user) {
				throw new ForbiddenException("User not found");
			}
			const chan = await this.prisma.channel.update({
				where: {
					id: id,
				},
				data: {
					members: {
						disconnect: {
							userName: userName,
						},
					},
					operators: {
						disconnect: {
							userName: userName,
						},
					},
				},
			});
			if (!chan) {
				throw new ForbiddenException("Prisma error while kicking");
			}
		} catch (error) {
			throw new ForbiddenException("Error while kicking");
		}
	}

	async banFromChannel(userName: string, id: number) {
		try {
			const user = await this.userService.getUserByUserName(userName);
			if (!user) {
				throw new ForbiddenException("User not found");
			}
			const chan = await this.prisma.channel.update({
				where: {
					id: id,
				},
				data: {
					members: {
						disconnect: {
							userName: userName,
						},
					},
					operators: {
						disconnect: {
							userName: userName,
						},
					},
					banList: {
						connect: {
							userName: userName,
						},
					},
				},
			});
			if (!chan) {
				throw new ForbiddenException("Prisma error while banishing");
			}
		} catch (error) {
			throw new ForbiddenException("Error while banishing");
		}
	}

	async muteInChannel(chanId: number, userId: number, mutedEnd: Date) {
		const retrieve = await this.prisma.muted.findMany({
			where: {
				userId: userId,
				channelId: chanId,
			},
		});
		let muted: Muted;
		if (!retrieve.at(0)) {
			muted = await this.prisma.muted.create({
				data: {
					userId: userId,
					muteExpiration: mutedEnd,
					channelId: chanId,
				},
			});
		} else {
			muted = await this.prisma.muted.update({
				where: {
					id: retrieve.at(0).id,
				},
				data: {
					userId: userId,
					muteExpiration: mutedEnd,
					channelId: chanId,
				},
			});
		}
		if (!muted) {
			throw new ForbiddenException("Can't mute this user");
		}
		if (muted) {
			const chan: Channel = await this.prisma.channel.update({
				where: {
					id: chanId,
				},
				data: {
					mutedList: {
						connect: {
							id: muted.id,
						},
					},
				},
				include: {
					members: {
						select: {
							id: true,
							userName: true,
						},
					},
					operators: {
						select: {
							id: true,
							userName: true,
						},
					},
					mutedList: {
						select: {
							id: true,
							userId: true,
							muteExpiration: true,
						},
					},
				},
			});
			if (!chan) {
				throw new ForbiddenException(
					"Error while adding the mute user in channel",
				);
			}
			return chan;
		}
	}

	async adminOfChannel(userName: string, id: number) {
		const user = await this.userService.getUserByUserName(userName);
		if (!user) {
			throw new ForbiddenException("This user doesn't exist");
		}
		const channel = await this.prisma.channel.findUnique({
			where: {
				id: id,
			},
			include: {
				operators: true,
			},
		});
		if (!channel) {
			throw new ForbiddenException("Channel doesn't exist");
		}
		if (channel && user) {
			const operatorExists = channel.operators.some(
				(member) => member.id === user.id,
			);
			if (operatorExists) {
				throw new ForbiddenException("Already an admin");
			} else {
				await this.prisma.channel.update({
					where: {
						id: id,
					},
					data: {
						operators: {
							connect: {
								id: user.id,
							},
						},
					},
				});
			}
			return await this.prisma.channel.findUnique({
				where: {
					id: id,
				},
				include: {
					members: {
						select: {
							id: true,
							userName: true,
						},
					},
					operators: {
						select: {
							id: true,
							userName: true,
						},
					},
				},
			});
		}
	}

	async createDM(
		newChannel: Prisma.ChannelCreateInput,
		userId1: number,
		userId2: number,
	) {
		const chanAlreadyExist = await this.prisma.channel.findUnique({
			where: {
				title: newChannel.title,
			},
		});
		if (chanAlreadyExist)
			throw new HttpException("Dm already exists", HttpStatus.FOUND);
		let hash: string = null;
		if (newChannel.password && newChannel.password !== "")
			hash = await argon2.hash(newChannel.password);
		try {
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
			await this.prisma.channel.update({
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
		} catch (error) {
			throw new ForbiddenException("Error creating Dm");
		}
	}

	async deleteDm(userName: string, title: string) {
		const user = await this.userService.getUserByUserName(userName);
		if (!user)
			throw new ForbiddenException("Can't find user friend, try again");
		const userChans = await this.getUsersDMs(userName);
		if (userChans.some((dm: Channel) => dm.title === title)) {
			await this.prisma.channel.delete({
				where: {
					title,
				},
			});
		}
	}

	async joinPublicChannel(userId: number, channelId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!user) {
			throw new ForbiddenException("User does'nt exist");
		}

		const channel = await this.prisma.channel.findUnique({
			where: { id: channelId },
			include: { members: true },
		});

		if (channel) {
			const memberExists = channel.members.some(
				(member) => member.id === userId,
			);
			if (memberExists) {
				throw new ForbiddenException("User already in channel");
			} else {
				const updatedChannel = await this.prisma.channel.update({
					where: { id: channelId },
					data: { members: { connect: { id: userId } } },
				});
				if (!updatedChannel) {
					throw new ForbiddenException("Can't update the channel");
				}
			}
		}
	}

	async getChannelByTitle(title: string) {
		return await this.prisma.channel.findUnique({
			where: {
				title: title,
			},
			include: {
				members: {
					select: {
						id: true,
						userName: true,
					},
				},
				operators: {
					select: {
						id: true,
						userName: true,
					},
				},
				mutedList: {
					select: {
						id: true,
						userId: true,
						muteExpiration: true,
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

	// async getPublicChannelsToJoin(userId: number): Promise<ChannelModel[]> {
	// 	const chans = await this.prisma.channel.findMany({
	// 		where: {
	// 			type: "Channel",
	// 			mode: "Public",
	// 			members: {
	// 				none: {
	// 					id: userId,
	// 				},
	// 			},
	// 			banList: {
	// 				none: {
	// 					id: userId,
	// 				},
	// 			},
	// 		},
	// 		include: {
	// 			members: {
	// 				select: { id: true, userName: true },
	// 			},
	// 			banList: true,
	// 			mutedList: true,
	// 			messages: true,
	// 			operators: true,
	// 		},
	// 	});
	// 	if (!chans) {
	// 		throw new ForbiddenException("Error while retrieving the channels");
	// 	}
	// 	return chans.map((channel) => new ChannelModel(channel));
	// }

	async getPublicChannelsToJoin(
		userId: number,
	): Promise<{ id: number; title: string }[]> {
		const chans = await this.prisma.channel.findMany({
			where: {
				type: "Channel",
				mode: "Public",
				members: {
					none: {
						id: userId,
					},
				},
				banList: {
					none: {
						id: userId,
					},
				},
			},
			select: {
				id: true,
				title: true,
			},
		});
		if (!chans) {
			throw new ForbiddenException("Error while retrieving the channels");
		}
		return chans;
	}

	async getUsersChannels(
		username: string,
	): Promise<{ id: number; title: string; ownerId: number }[]> {
		const user = await this.prisma.user.findUnique({
			where: {
				userName: username,
			},
		});
		if (!user) {
			throw new ForbiddenException("User does'nt exist");
		}

		const chans = await this.prisma.channel.findMany({
			select: {
				id: true,
				title: true,
				ownerId: true,
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
		if (!chans) {
			throw new ForbiddenException("Can't retrieve channels");
		}
		return chans;
	}

	async getUsersDMs(username: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				userName: username,
			},
		});
		if (!user) {
			throw new ForbiddenException("User does'nt exist");
		}

		const chans = await this.prisma.channel.findMany({
			include: {
				owner: true,
				members: true,
				operators: true,
				messages: true,
				banList: true,
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
		if (!chans) {
			throw new ForbiddenException("Error while retrieving the channels");
		}
		return chans;
	}

	async getUserDirectMessages(username: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				userName: username,
			},
		});
		if (!user) {
			throw new ForbiddenException("User does'nt exist");
		}

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
		if (!chans) {
			throw new ForbiddenException("Error while retrieving the channels");
		}
		return chans;
	}

	async getChanMessages(userName: string, title: string) {
		const chan = await this.prisma.channel.findUnique({
			where: {
				title: title,
			},
			include: {
				members: true,
			},
		});
		if (!chan) {
			return null;
		}
		const user = await this.userService.getUserByUserName(userName);
		const match = chan.members.filter((el) => {
			return el.id === user.id;
		});
		const boolMatch: boolean = match.length > 0 ? true : false;
		if (chan && user && boolMatch) {
			const chanWithoutMembers = await this.prisma.channel.findUnique({
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
					channel: chanWithoutMembers,
				},
			});
			return msgs;
		} else {
			return null;
		}
	}

	async getDMsMessages(userName: string, title: string) {
		const user = await this.userService.getUserByUserName(userName);
		if (!user) throw new HttpException("User not found", HttpStatus.NOT_FOUND);
		const chan = await this.prisma.channel.findUnique({
			where: {
				title: title,
			},
			include: {
				members: true,
			},
		});
		if (!chan)
			throw new HttpException("Can't find channel", HttpStatus.NOT_FOUND);
		const match = chan.members.some((el) => {
			return el.id === user.id;
		});
		if (!match)
			throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
		const otherUser = chan.members.find((u) => u.id !== user.id);
		const msgs = await this.prisma.message.findMany({
			include: {
				author: {
					select: {
						id: true,
						userName: true,
					},
				},
				channel: true,
			},
			where: {
				channelId: chan.id,
			},
		});
		return {
			msgs,
			otherUser: { id: otherUser.id, userName: otherUser.userName },
		};
	}

	async getInviteList(
		title: string,
		userName: string,
	): Promise<{ id: number; userName: string }[]> {
		const user = await this.userService.getUserByUserName(userName);
		const chan = await this.getChannelByTitle(title);
		if (!user || !chan)
			throw new ForbiddenException("Can't retrieve invite list");
		const membersNotInChannel = await this.prisma.user.findMany({
			where: {
				NOT: {
					channels: {
						some: {
							id: chan.id,
						},
					},
				},
			},
			select: {
				id: true,
				userName: true,
			},
		});
		const membersBanned = await this.prisma.user.findMany({
			where: {
				chanBans: {
					some: {
						id: chan.id,
					},
				},
			},
			select: {
				id: true,
				userName: true,
			},
		});
		if (!membersNotInChannel || !membersBanned) {
			throw new ForbiddenException("Can't retrieve invite list");
		}
		const filteredMembers = membersNotInChannel.filter((member) => {
			return !membersBanned.some(
				(bannedMember) => bannedMember.id === member.id,
			);
		});
		return filteredMembers;
	}

	async addToChannel(title: string, userId: number): Promise<void> {
		try {
			await this.prisma.channel.update({
				where: {
					title: title,
				},
				data: {
					members: {
						connect: {
							id: userId,
						},
					},
				},
			});
		} catch (error) {
			throw new ForbiddenException("Can't add a user in chan");
		}
	}

	async checkSecret(
		chanId: number,
		secret: string,
		userName: string,
	): Promise<void> {
		const channel = await this.prisma.channel.findUnique({
			where: {
				id: chanId,
			},
			include: {
				members: true,
			},
		});
		const user = await this.userService.getUserByUserName(userName);

		if (channel && user) {
			const memberExists = channel.members.some(
				(member) => member.id === user.id,
			);
			if (memberExists) {
				let hash: string = null;
				if (channel && secret && secret !== "") {
					hash = await argon2.hash(secret);
					if (await argon2.verify(channel.password, secret)) {
						return;
					} else {
						throw new ForbiddenException("Password doesn't match");
					}
				}
			} else {
				throw new ForbiddenException("User not in channel");
			}
		}
	}
}
