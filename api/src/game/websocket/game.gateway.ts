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
import { UserService } from "./../../user/user.service";
import { User } from "@prisma/client";

interface Pair {
	client: Socket;
	user: User;
}

@WebSocketGateway(8001, { namespace: "game", cors: "*" })
export class GameGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private readonly logger = new Logger(GameGateway.name);
	@WebSocketServer()
	io: Namespace;
	socketToUser: Map<string, Pair> = new Map<string, Pair>();
	userToSocket: Map<number, Pair> = new Map<number, Pair>();

	constructor(private userService: UserService) {}

	afterInit(): any {
		this.logger.log("Websocket GameGateway initialized.");
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
		if (this.userToSocket.has(user.id)) {
			const oldClient = this.userToSocket.get(user.id).client;
			return;
		}

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

	@SubscribeMessage("joinGame")
	handleNewGame(
		@ConnectedSocket() client: Socket,
		@MessageBody() message: string,
	): void {
		// this.io.emit("message", message);
		// console.log("new message")
	}

	@SubscribeMessage("updatePlayerPaddlePos")
	handleLeftPaddlePosUpdate(@MessageBody() position: number): void {
		this.io.emit("leftPaddlePosUpdate", position);
		this.logger.log("left paddle pos update: ", position);
	}

	@SubscribeMessage("updateOwnerPaddlePos")
	handleRightPaddlePosUpdate(@MessageBody() position: number): void {
		this.io.emit("rightPaddlePosUpdate", position);
		this.logger.log("right paddle pos update: ", position);
	}

	@SubscribeMessage("updateBallPos")
	handleBallPosUpdate(@MessageBody() position: { x: number; y: number }): void {
		this.io.emit("ballPosUpdate", { x: position.x, y: position.y });
		this.logger.log("ball pos update: x: ", position.x, " y: ", position.y);
	}
}
