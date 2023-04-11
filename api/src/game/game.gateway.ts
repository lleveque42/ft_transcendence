import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";

@WebSocketGateway(8001, { cors: "*" })
export class GameGateway {
	@WebSocketServer()
	server;

	// @SubscribeMessage("newGame")
	// handleNewGame(@MessageBody() message: string): void {
	// 	this.server.emit("message", message);
	// 	console.log("new message")
	// }
	// @

	handleDisconnect(client: any) {
		console.log("New disconnection.");
	}

	handleConnection(client: any, ...args: any) {
		console.log("New connection.");
	}

	@SubscribeMessage("updateLeftPaddlePos")
	handleLeftPaddlePosUpdate(@MessageBody() position: number): void {
		this.server.emit("leftPaddlePosUpdate", position);
		console.log("left paddle pos update: ", position);
	}

	@SubscribeMessage("updateRightPaddlePos")
	handleRightPaddlePosUpdate(@MessageBody() position: number): void {
		this.server.emit("rightPaddlePosUpdate", position);
		console.log("right paddle pos update: ", position);
	}

	@SubscribeMessage("updateBallPos")
	handleBallPosUpdate(@MessageBody() position: { x: number; y: number }): void {
		this.server.emit("ballPosUpdate", {x: position.x, y: position.y});
		console.log("ball pos update: x: ", position.x, " y: ", position.y);
	}
}
