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
import { UserService } from "../user/user.service";
import { User } from "@prisma/client";
import { OnlineUsers } from "../classes/OnlineUsers";
import { GameQueue } from "../classes/GameQueue";
import { Pair } from "../classes/types/Pair";
import { randomUUID } from "crypto";
import { OngoingGames } from "../classes/OngoingGames";

@WebSocketGateway(8001, { namespace: "game", cors: "*" })
export class GameGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private readonly logger = new Logger(GameGateway.name);
	@WebSocketServer()
	io: Namespace;
	users: OnlineUsers = new OnlineUsers();
	queue: GameQueue = new GameQueue();
	ongoing: OngoingGames = new OngoingGames();
	constructor(private userService: UserService) {}

	afterInit(): any {
		this.logger.log("Websocket GameGateway initialized.");
	}

	handleDisconnect(@ConnectedSocket() client: Socket) {
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

	createGame(): string {
		const idPair = this.queue.getPair();
		const usersPair: Pair<User> = {
			first: this.users.getUserByUserId(idPair.first),
			second: this.users.getUserByUserId(idPair.second),
		};
		const socketsPair: Pair<Map<string, Socket>> = {
			first: this.users.getClientsByUserId(idPair.first),
			second: this.users.getClientsByUserId(idPair.second),
		};
		const newRoom: string = randomUUID();
		socketsPair.first.forEach((value) => {
			value.join(newRoom);
		});
		socketsPair.second.forEach((value) => {
			value.join(newRoom);
		});
		this.ongoing.addGame(newRoom, usersPair.first, usersPair.second);
		return newRoom;
	}

	endGame(room: string) {
		const game = this.ongoing.getGameById(room);
		const socketsPair: Pair<Map<string, Socket>> = {
			first: this.users.getClientsByUserId(game.ownerId),
			second: this.users.getClientsByUserId(game.playerId),
		};
		this.io.to(room).emit("gameEnded");
		if (game.ownerScore === 1) {
			socketsPair.first.forEach((value) => {
				value.emit("gameWin");
				value.leave(room);
			});
			socketsPair.second.forEach((value) => {
				value.leave(room);
			});
		} else {
			socketsPair.first.forEach((value) => {
				value.leave(room);
			});
			socketsPair.second.forEach((value) => {
				value.emit("gameWin");
				value.leave(room);
			});
		}
		this.ongoing.removeGame(room);
	}

	@SubscribeMessage("showUsers")
	showUsers(@ConnectedSocket() client: Socket) {
		this.users.showOnlineUsers();
	}

	@SubscribeMessage("joinQueue")
	handleNewGame(@ConnectedSocket() client: Socket): void {
		const user = this.users.getUserByClientId(client.id);
		if (!this.queue.alreadyQueued(user.id)) {
			try {
				this.queue.enqueue(user.id);
				this.logger.log(`${user.userName} joined queue.`);
				this.logger.log(`${this.queue.size()} user(s) queued.`);
				client.emit("queuedSuccess");
			} catch (e) {
				client.emit("queuedFail", e);
			}
		} else {
			client.emit("queuedAlready");
			this.logger.log(`${user.userName} already queued.`);
		}
		if (this.queue.size() === 2) {
			const room = this.createGame();
			client.emit("gameOwner", false);
			this.io.to(room).emit("joinedGame", room);
			this.logger.log(
				`${this.ongoing.getGameById(room).owner.userName} vs ${
					user.userName
				}. launched.`,
			);
		} else client.emit("gameOwner", true);
	}

	@SubscribeMessage("updatePlayerPaddlePos")
	handleLeftPaddlePosUpdate(
		@MessageBody() msg: { y: number; room: string },
	): void {
		this.io.to(msg.room).emit("leftPaddlePosUpdate", msg.y);
	}

	@SubscribeMessage("updateOwnerPaddlePos")
	handleRightPaddlePosUpdate(
		@MessageBody() msg: { y: number; room: string },
	): void {
		this.io.to(msg.room).emit("rightPaddlePosUpdate", msg.y);
	}

	@SubscribeMessage("updateBallPos")
	handleBallPosUpdate(
		@MessageBody() msg: { position: { x: number; y: number }; room: string },
	): void {
		this.io
			.to(msg.room)
			.emit("ballPosUpdate", { x: msg.position.x, y: msg.position.y });
	}

	@SubscribeMessage("playerScored")
	playerScored(@MessageBody() room: string): void {
		this.io.to(room).emit("playerScored");
		if (this.ongoing.playerScored(room)) this.endGame(room);
	}

	@SubscribeMessage("ownerScored")
	ownerScored(@MessageBody() room: string): void {
		this.io.to(room).emit("ownerScored");
		if (this.ongoing.ownerScored(room)) this.endGame(room);
	}
}
