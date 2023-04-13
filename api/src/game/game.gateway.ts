import { Logger } from "@nestjs/common";
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

@WebSocketGateway(8001, { namespace: "game", cors: "*" })
export class GameGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private readonly logger = new Logger(GameGateway.name);
	@WebSocketServer()
	io: Namespace;

	afterInit(): any {
		this.logger.log("Websocket gateway initialized.");
	}

	handleConnection(client: Socket, ...args: any) {
		this.logger.log(`WS Client with id: ${client.id} connected !`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log("New disconnection.");
	}

	// @SubscribeMessage("newGame")
	// handleNewGame(@MessageBody() message: string): void {
	// 	this.io.emit("message", message);
	// 	console.log("new message")
	// }
	// @

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