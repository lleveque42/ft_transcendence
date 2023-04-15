import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway(8001, { cors: "*" })
export class ServerGateway {
	@WebSocketServer()
	server: Server;
	@SubscribeMessage("private_message")
	handleMessage(@MessageBody() data: { message; id }): void {
		console.log("Content :" + data.message);
		console.log("Socket :" + data.id);
		this.server.to(`${data.id}`).emit("private_message", data.message);
	}
}
