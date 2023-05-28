import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";
import { UserService } from "./../user/user.service";
import { MessageService } from "./../message/message.service";
import { ChannelService } from "./../channel/channel.service";
import { HttpException, Logger } from "@nestjs/common";
import { OnlineUsers } from "../classes/OnlineUsers";
import { User } from "@prisma/client";

@WebSocketGateway(8001, { namespace: "chat", cors: process.env.FRONTEND_URL })
export class ServerGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private readonly logger = new Logger(ServerGateway.name);
	@WebSocketServer()
	io: Namespace;
	users: OnlineUsers = new OnlineUsers();

	constructor(
		private userService: UserService,
		private channelService: ChannelService,
		private messageService: MessageService,
	) {}

	afterInit(): any {
		this.logger.log("Websocket ChatGateway initialized.");
	}

	handleDisconnect(client: Socket) {
		const user: User = this.users.getUserByClientId(client.id);
		if (!user) return;
		this.logger.log(`WS Client ${client.id} (${user.userName}) disconnected !`);
		this.users.removeClientId(client.id);
		this.logger.log(`${this.users.size} user(s) connected !`);
	}

	async handleConnection(@ConnectedSocket() client: Socket) {
		const user = await this.userService.getUserByEmail(
			`${client.handshake.query.email}`,
		);
		if (!user) {
			this.logger.log(
				`Could not connect: ${
					client.handshake.query.email === undefined
						? "no email provided"
						: "user does not exist."
				}`,
			);
			client.emit("connectionFailed");
			client.disconnect();
			return;
		}
		if (this.users.hasByUserId(user.id))
			this.users.addClientToUserId(user.id, client);
		else this.users.addNewUser(user, client);

		// Function to join all rooms
		const clients = this.users.getClientsByUserId(user.id);
		const channels = await this.channelService.getUsersChannels(user.userName);
		clients.forEach((value) => {
			for (let chan of channels) {
				// console.log("This socket : " + value.id + " joined " + chan.title);
				value.join(chan.title);
			}
		});
		const dms = await this.channelService.getUsersDMs(user.userName);
		clients.forEach((value) => {
			for (let dm of dms) {
				// console.log("This socket : " + value.id + " joined " + dm.title);
				value.join(dm.title);
			}
		});
		this.logger.log(`WS Client ${client.id} (${user.userName}) connected !`);
		this.logger.log(`${this.users.size} user(s) connected !`);
	}

	@SubscribeMessage("private_message")
	async handlePrivateMessage(
		@MessageBody() data: { sender; message; socket; receiver },
	): Promise<void> {
		try {
			this.userService.setUserSocket(data.sender, data.socket);
			const sender = await this.userService.getUserByUserName(data.sender);
			const user = await this.userService.getUserByUserName(data.receiver);
			if (sender && user) {
				this.io.emit("private_message", sender.userName, data.message);
			}
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@SubscribeMessage("chanMessage")
	async handleChanMessage(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: {
			room: string;
			message: string;
		},
	): Promise<void> {
		const rooms: Set<string> = client.rooms;
		const val = [...rooms][0];
		let isInChannel: boolean = false;
		rooms.forEach((room) => {
			if (room === data.room) {
				isInChannel = true;
			}
		});
		if (!isInChannel) {
			this.io
				.to(val)
				.emit(
					"errorSendingMessage",
					await this.users.getUserByClientId(client.id).userName,
				);
			return;
		}
		try {
			const msg = await this.messageService.createNewNessage(
				{
					content: data.message,
				},
				this.users.getUserByClientId(client.id).id,
				data.room,
			);
			if (msg) {
				this.io.to(data.room).emit("receivedMessage", msg);
			} else {
				console.log("No msg created");
			}
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@SubscribeMessage("joinChatRoom")
	async handleJoinChanRoom(socket: Socket, chanName: string): Promise<void> {
		const sockets = this.users.getClientsByClientId(socket.id);
		if (sockets) {
			for (const socket of sockets) {
				socket[1].join(chanName);
			}
		}
		const chan = await this.channelService.getChannelByTitle(chanName);
		if (chan) {
			this.io.to(chanName).emit("userJoinedChan", chan);
			this.io.emit("addChannelToJoin", chan);
		}
	}

	@SubscribeMessage("joinDMRoom")
	async handleJoinDMRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: {
			room: string;
			userId2: number;
			userId: number;
		},
	): Promise<void> {
		const sockets = this.users.getClientsByClientId(client.id);
		const sockets2 = this.users.getClientsByUserId(data.userId2);
		if (sockets) {
			for (const socket of sockets) {
				socket[1].join(data.room);
			}
		}
		if (sockets2) {
			for (const socket of sockets2) {
				socket[1].join(data.room);
			}
		}
		this.io.to(data.room).emit("userExpel", data.userId);
		const chan = await this.channelService.getChannelByTitle(data.room);
		if (chan) {
			this.io.to(data.room).emit("userJoinedDM", chan);
		}
	}

	@SubscribeMessage("exitChatRoom")
	async handleExitChanRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: {
			id: number;
			room: string;
			userName: string;
			mode: string;
		},
	): Promise<void> {
		const user = await this.userService.getUserByUserName(data.userName);
		if (user) {
			this.io
				.to(data.room)
				.emit(
					"kickOrBanOrLeaveFromChannel",
					await this.channelService.getChannelByTitle(data.room),
					data.userName,
					data.mode,
				);
			this.io
				.to(data.room)
				.emit(
					"newLeftChan",
					await this.channelService.getChannelByTitle(data.room),
					data.userName,
					data.mode,
				);
			const chan = await this.channelService.getChannelByTitle(data.room);
			if (user && chan) {
				this.io.to(chan.title).emit("addChannelToJoin", chan, user.id);
			}
		}
		const sockets = await this.users.getClientsByUserId(user.id);
		if (sockets) {
			for (const socket of sockets) {
				socket[1].leave(data.room);
			}
		}
	}

	@SubscribeMessage("MuteInChatRoom")
	async handleMuteInChatChanRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: {
			id: string;
			room: string;
			userName: string;
			mode: string;
		},
	): Promise<void> {
		this.io
			.to(data.id)
			.emit(
				"refreshMute",
				await this.channelService.getChannelByTitle(data.id),
				data.userName,
				data.mode,
			);
	}

	@SubscribeMessage("adminChatRoom")
	async handleAdminChanRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: {
			id: number;
			room: string;
			userName: string;
			mode: string;
		},
	): Promise<void> {
		this.io
			.to(data.room)
			.emit(
				"adminJoinedChan",
				await this.channelService.getChannelByTitle(data.room),
				data.userName,
				data.mode,
			);
	}

	@SubscribeMessage("addUserToChan")
	async handleAddUserToChan(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: {
			room: string;
			userId: number;
		},
	): Promise<void> {
		if (data.room && data.userId) {
			const sockets = this.users.getClientsByUserId(data.userId);
			if (sockets) {
				for (const socket of sockets) {
					socket[1].join(data.room);
				}
			}
			const user = await this.userService.getUserById(data.userId);
			const chan = await this.channelService.getChannelByTitle(data.room);
			if (user && chan) {
				this.io.to(chan.title).emit("userJoinedChan", chan);
				this.io.to(chan.title).emit("removeFromInviteList", chan, user);
				this.io.to(chan.title).emit("newInvitedChan", chan, data.userId);
				this.io.to(chan.title).emit("removeFromJoin", chan, data.userId);
				this.io.to(chan.title).emit("addChannelToJoin", chan, data.userId);
			}
		}
	}
}
