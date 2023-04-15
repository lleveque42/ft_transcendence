import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { UserService } from "./../user/user.service";
import { HttpException } from "@nestjs/common";

@WebSocketGateway(8001, { cors: "*" })
export class ServerGateway {
	constructor(private userService: UserService) {}

	@WebSocketServer()
	server: Server;
	@SubscribeMessage("private_message")
	async handleMessage(
		@MessageBody() data: { sender; message; socket; receiver },
	): Promise<void> {
		console.log("Sender :" + data.sender);
		console.log("Content :" + data.message);
		console.log("Socket :" + data.socket);
		console.log("Username :" + data.receiver);
		// this.server.to(`${data.id}`).emit("private_message", data.message);

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
					"User " + user.userName + " at socket: *" + user.socket + "*",
				);
			} else {
				console.log("No user found");
			}
		} catch (e) {
			throw new HttpException(e.message, e.status);
		}

		//		this.server.to("").emit("private_message", data.message);
		this.server.emit("private_message", data.message);
	}
}
