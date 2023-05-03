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

interface Pair {
	client: Socket;
	user: User;
}

@WebSocketGateway(8001, { cors: "*" })
export class AppGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private readonly logger = new Logger(AppGateway.name);
	@WebSocketServer()
	io: Namespace;
	socketToUser: Map<string, Pair> = new Map<string, Pair>();
	userToSocket: Map<number, Pair> = new Map<number, Pair>();

	constructor(private userService: UserService) {}

	afterInit(): any {
		this.logger.log("Websocket AppGateway initialized.");
	}

	handleDisconnect(client: Socket) {
		const pair = this.socketToUser.get(client.id);
		if (!pair) return;
		this.logger.log(
			`WS Client ${client.id} (${pair.user.userName}) disconnected !`,
		);
		this.userToSocket.delete(pair.user.id);
		this.socketToUser.delete(client.id);
		this.logger.log(`${this.socketToUser.size} user(s) connected !`);
	}

	async handleConnection(@ConnectedSocket() client: Socket) {
		const user = await this.userService.getUserByEmail(
			`${client.handshake.query.email}`,
		);

		// si un user est déjà connecté sur une autre page, on le reco sur cette page
		// comme si de rien était mais on le comptabilise pas comme un nouveau user
		if (this.userToSocket.has(user.id))
			return;

		this.logger.log(`WS Client ${client.id} (${user.userName}) connected !`);
		this.socketToUser.set(client.id, {
			client,
			user,
		});
		this.userToSocket.set(user.id, {
			client,
			user,
		});
		this.logger.log(`${this.socketToUser.size} user(s) connected !`);

		// // afficher tous les users
		// this.socketToUser.forEach((value) => {
		// 	console.log("new user");
		// 	console.log(value.user);
		// });
	}
}
