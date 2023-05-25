import { ForbiddenException, HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";
import { Channel, Muted, Prisma, User } from "@prisma/client";
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
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				throw new ForbiddenException("Duplicate key value");
			} else {
				console.log("Error in update");
			}
		}
	}

	async kickFromChannel(userName: string, id: number) {
		try {
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
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				throw new ForbiddenException("Duplicate key value");
			} else {
				console.log("Error in update");
			}
		}
	}

	async banFromChannel(userName: string, id: number) {
		try {
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
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				throw new ForbiddenException("Duplicate key value");
			} else {
				console.log("Error in update");
			}
		}
	}

	async muteInChannel(chanId: number, userId: number, mutedEnd: Date) {
		try {
			const retrieve = await this.prisma.muted.findMany({
				where: {
					userId: userId,
				},
			});
			const muted: Muted = await this.prisma.muted.upsert({
				where: {
					id: retrieve.at(0).id,
				},
				update: {
					muteExpiration: mutedEnd,
					channelId: chanId,
				},
				create: {
					userId: userId,
					muteExpiration: mutedEnd,
					channelId: chanId,
				},
			});
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
				return chan;
			}
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				throw new ForbiddenException("Duplicate key value");
			} else {
				console.log("Error in update");
			}
		}
	}

	async adminOfChannel(userName: string, id: number) {
		try {
			const chan = await this.prisma.channel.update({
				where: {
					id: id,
				},
				data: {
					operators: {
						connect: {
							userName: userName,
						},
					},
				},
			});
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
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				throw new ForbiddenException("Duplicate key value");
			} else {
				console.log("Error in update");
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
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				throw new ForbiddenException("Duplicate key value");
			}
		}
	}

	async joinPublicChannel(userId: number, channelId: number) {
		const updatedChannel = await this.prisma.channel.update({
			where: { id: channelId },
			data: { members: { connect: { id: userId } } },
		});
		return updatedChannel;
	}

	async getChannelByTitle(title: string) {
		console.log(title);

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

	async getPublicChannelsToJoin(userId: number): Promise<Channel[]> {
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
				banList: true,
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

	async getChanMessages(userName, title) {
		const chan = await this.prisma.channel.findUnique({
			where: {
				title: title,
			},
			include: {
				members:true,
			}
		});
		if (!chan){
			return null;
		}
		const user = await this.userService.getUserByUserName(userName);
		const match = chan.members.filter((el) =>{
			return (el.id === user.id);
		} )
		const boolMatch : boolean = match.length > 0 ? true : false;
		if (chan && user && boolMatch){
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

	async getDMsMessages(userName, title) {
		const chan = await this.prisma.channel.findUnique({
			where: {
				title: title,
			},
			include: {
				members:true,
			}
		});
		if (!chan){
			return null;
		}
		const user = await this.userService.getUserByUserName(userName);
		const match = chan.members.filter((el) =>{
			return (el.id === user.id);
		} )
		const boolMatch : boolean = match.length > 0 ? true : false;
		if (chan && user && boolMatch){
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
					channelId: chanWithoutMembers.id,
				},
			});
			if (msgs){
				console.log(msgs);
				return msgs;
			} else {return null}
		} else {
			return null;
		}
	}

	async getInviteList(title : string, userName : string) : Promise<{ id: number; userName: string; }[]> {
		const user = await this.userService.getUserByUserName(userName);
		if (!user)
			return null;
		const allUsers = await this.prisma.user.findMany({
			where: {
				NOT: {
					userName: userName,
				}
			},
			select: {
				id: true,
				userName: true,
			}
		});
		const members = await this.prisma.channel.findUnique({
			where: {
				title: title,
			},
			include: {
				members: {
					select: {
						id: true,
						userName: true,
					}
				}
			}
		});
		const banned = await this.prisma.channel.findUnique({
			where: {
				title: title,
			},
			include: {
				banList: {
					select: {
						id: true,
						userName: true,
					}
				},
			}
		});
		if (!banned || !members || !allUsers){
			return null;
		}
		const bannedList : Array<{id: number, userName: string}> = banned.banList;
		const membersList : Array<{id: number, userName: string}> = members.members;
		// const differenceBanned = allUsers.filter( x => !bannedList.includes(x) && !membersList.includes(x) );
		const differenceBanned = allUsers.filter( x => !bannedList.some((banned) => banned.id !== x.id) && !membersList.some((member) => member.id !== x.id));
		console.log(allUsers);
		console.log(bannedList);
		console.log(membersList);
		console.log(differenceBanned);
			
		
		// const filteredUsers = allUsers.filter((u) => {
        //     const blockedUsers = u.banned.map((blocked) => blocked.id);
        //     return (
        //         !blockedUsers.includes(user.id) &&
        //         !usersBlocked.blockList.some((blockedUser) => blockedUser.id === u.id)
        //     );
        // });
		return allUsers;
	}

	async addToChannel(title : string, userId : number) : Promise<void> {
		try {
			await this.prisma.channel.update({
				where: {
					title: title,
				},
				data : {
					members : {
						connect : {
							id: userId,
						}
					}
				}
			});
		} catch ( error ){
			throw new ForbiddenException("Can't add a user in chan");
		}
	}
	
	async dropdb() {
		await this.prisma.channel.deleteMany({});
	}
}
