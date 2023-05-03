import { Logger } from "@nestjs/common";
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
import { UserService } from "./user/user.service";
import { User } from "@prisma/client";
import { OnlineUsers } from "./classes/OnlineUsers";

@WebSocketGateway(8001, { cors: "*" })
export class AppGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private readonly logger = new Logger(AppGateway.name);
	@WebSocketServer()
	io: Namespace;
	users: OnlineUsers = new OnlineUsers();

	constructor(private userService: UserService) {}

	afterInit(): any {
		this.logger.log("Websocket AppGateway initialized.");
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
		if (this.users.hasByUserId(user.id))
			this.users.addClientToUserId(user.id, client);
		else this.users.addNewUser(user, client);
		this.logger.log(`WS Client ${client.id} (${user.userName}) connected !`);
		this.logger.log(`${this.users.size} user(s) connected !`);
	}

	@SubscribeMessage("showUsers")
	showUsers(@ConnectedSocket() client: Socket) {
	}
}
