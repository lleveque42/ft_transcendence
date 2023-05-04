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
import { log } from "console";

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
		// this.io.to(`${data.id}`).emit("private_message", data.message);
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
			console.log("Room = " + data.room);
			const msg = await this.messageService.createNewNessage(
				{
					content: data.message,
				},
				this.users.getUserByClientId(client.id).userName,
				data.room,
			);
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
				this.io
					.to("chan" + data.room)
					.emit(
						"receivedMessage",
						msg.id,
						msg.authorId,
						msg.channelId,
						msg.content,
					);
			} else {
				console.log("No msg created");
			}
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}
	}

	@SubscribeMessage("joinChatRoom")
	async handleJoinRoom(socket: Socket, chanName: string): Promise<void> {
		console.log(
			"The socket " +
				socket.id +
				" trying to connect to the chan " +
				chanName +
				".",
		);
		const sockets = this.users.getClientsByClientId(socket.id);
		for (const socket of sockets) {
			socket[1].join("chan" + chanName);
		}
		//console.log(socket.rooms);
	}

	// @SubscribeMessage("new_channel")
	// async newChannel(
	// 	@MessageBody() data: { title; password; type; username },
	// ): Promise<void> {
	// 	// this.io.to(`${data.id}`).emit("private_message", data.message);
	// 	try {
	// 		this.channelService.createChannel(
	// 			{
	// 				title: data.title,
	// 				type: data.type,
	// 			},
	// 			data.username,
	// 		);
	// 		//	this.io.to("").emit("private_message", data.message);
	// 	} catch (e) {
	// 		throw new HttpException(e.message, e.status);
	// 	}
	// }
}
