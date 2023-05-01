import {
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

@WebSocketGateway(8001, { namespace: "chat", cors: "*" })
export class ServerGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		private userService: UserService,
		private channelService: ChannelService,
		private messageService: MessageService,
	) {}
	private readonly logger = new Logger(ServerGateway.name);
	@WebSocketServer()
	io: Namespace;

	afterInit(): any {
		this.logger.log("Websocket GameGateway initialized.");
	}

	handleConnection(client: Socket, ...args: any) {
		this.logger.log(`WS Client ${client.id} connected !`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`WS Client ${client.id} disconnected !`);
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

		//	this.io.to("").emit("private_message", data.message);
	}

	@SubscribeMessage("chanMessage")
	async handleChanMessage(
		@MessageBody() data: { room; sender; message; value },
	): Promise<void> {
		console.log("Room :" + data.room);
		console.log("Sender :" + data.sender);
		console.log("Content :" + data.message);
		// this.io
		// 	.to("chan" + data.room)
		// 	.emit("receivedMessage", data.sender, data.message);
		// this.io
		// .to("chan" + data.room)
		// .emit("receivedMessage", message);
		try {
			const msg = await this.messageService.createNewNessage(
				{
					content: data.message,
				},
				data.sender,
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
						"*",
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
	handleJoinRoom(socket: Socket, chanName: string): void {
		console.log(
			"The socket " +
				socket.id +
				" trying to connect to the chan " +
				chanName +
				".",
		);
		socket.join("chan" + chanName);
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
