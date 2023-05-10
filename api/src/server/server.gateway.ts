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

@WebSocketGateway(8001, { namespace: "chat", cors: "*" })
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
				console.log("This socket : " + value.id + "joined " + chan.title);
				value.join(chan.title);
			}
		});
		const dms = await this.channelService.getUsersDMs(user.userName);
		clients.forEach((value) => {
			for (let dm of channels) {
				console.log("This socket : " + value.id + "joined " + dm.title);
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
		console.log("Sender :" + data.sender);
		console.log("Content :" + data.message);
		console.log("Socket :" + data.socket);
		console.log("Receiver :" + data.receiver);
		try {
			this.userService.setUserSocket(data.sender, data.socket);
			const sender = await this.userService.getUserByUserName(data.sender);
			if (sender) {
				console.log(
					"Sender " + sender.userName + " at socket: *" + sender.socket + "*",
				);
			} else {
				console.log("No sender found");
			}
			const user = await this.userService.getUserByUserName(data.receiver);
			if (user) {
				console.log(
					"Receiver " + user.userName + " at socket: *" + user.socket + "*",
				);
			} else {
				console.log("No user found");
			}
			this.io.emit("private_message", sender.userName, data.message);
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
			value: string;
		},
	): Promise<void> {
		try {
			const msg = await this.messageService.createNewNessage(
				{
					content: data.message,
				},
				this.users.getUserByClientId(client.id).userName,
				data.room,
			);
			console.log(msg);
			if (msg) {
				console.log(
					"Sender " +
						msg.authorId +
						" in channel : *" +
						msg.channelId +
						"* content: *" +
						msg.content +
						"* at *" +
						data.room +
						"*" +
						" ",
				);
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
		console.log(
			"The socket " +
				socket.id +
				" trying to connect to the chan " +
				chanName +
				".",
		);
		const sockets = this.users.getClientsByClientId(socket.id);
		for (const socket of sockets) {
			socket[1].join(chanName);
		}
	}

	@SubscribeMessage("joinDMRoom")
	async handleJoinDMRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: {
			room: string;
			userId2: string;
		},
	): Promise<void> {
		console.log(
			"The socket " +
				client.id +
				" trying to connect to the dm " +
				data.room +
				" with " +
				data.userId2 +
				".",
		);
		const sockets = this.users.getClientsByClientId(client.id);
		const sockets2 = this.users.getClientsByUserId(parseInt(data.userId2, 10));
		for (const socket of sockets) {
			socket[1].join(data.room);
		}
		for (const socket of sockets2) {
			socket[1].join(data.room);
		}
		this.io
			.to(data.room)
			.emit(
				"receivedDirectMessage",
				this.channelService.getChannelByTitle(data.room),
			);
	}
}
