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
import { OnlineUsers } from "../../classes/OnlineUsers";

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
	users: OnlineUsers = new OnlineUsers();

	constructor(private userService: UserService) {}

	afterInit(): any {
		this.logger.log("Websocket GameGateway initialized.");
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

	// @SubscribeMessage("showUsers")
	// showUsers(@ConnectedSocket() client: Socket) {
	// }

	// @SubscribeMessage("joinGame")
	// handleNewGame(
	// 	@ConnectedSocket() client: Socket,
	// 	@MessageBody() message: string,
	// ): void {
	// 	const pair = this.socketToUser.get(client.id);
	// 	this.logger.log("")
	// 	// this.io.emit("message", message);
	// 	// console.log("new message")
	// }

	// @SubscribeMessage("updatePlayerPaddlePos")
	// handleLeftPaddlePosUpdate(@MessageBody() position: number): void {
	// 	this.io.emit("leftPaddlePosUpdate", position);
	// 	this.logger.log("left paddle pos update: ", position);
	// }

	// @SubscribeMessage("updateOwnerPaddlePos")
	// handleRightPaddlePosUpdate(@MessageBody() position: number): void {
	// 	this.io.emit("rightPaddlePosUpdate", position);
	// 	this.logger.log("right paddle pos update: ", position);
	// }

	// @SubscribeMessage("updateBallPos")
	// handleBallPosUpdate(@MessageBody() position: { x: number; y: number }): void {
	// 	this.io.emit("ballPosUpdate", { x: position.x, y: position.y });
	// 	this.logger.log("ball pos update: x: ", position.x, " y: ", position.y);
	// }
}
