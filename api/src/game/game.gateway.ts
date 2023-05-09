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
import { User, UserStatus } from "@prisma/client";
import { OnlineUsers } from "../classes/OnlineUsers";
import { GameQueue } from "../classes/GameQueue";
import { Pair } from "./types/pair.type";
import { randomUUID } from "crypto";
import { GAME_LIMIT_SCORE, OngoingGames } from "../classes/OngoingGames";
import { GameType } from "./types/game.type";

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
		if (this.queue.alreadyQueued(user.id)) client.emit("connectionInQueue");
		else if (this.ongoing.alreadyInGame(user.id))
			client.emit("connectionInGame");
		else client.emit("connectionSuccess");
		this.logger.log(`WS Client ${client.id} (${user.userName}) connected !`);
		this.logger.log(`${this.users.size} user(s) connected !`);
	}

	async changeUserStatus(user: User, inGame: boolean) {
		const newStatus = inGame ? UserStatus.INGAME : UserStatus.ONLINE;
		await this.userService.changeUserStatus(user.id, newStatus);
		let onlineFriends = await this.users.getFriendsOfByUserId(
			user.id,
			this.userService,
		);
		for (let friend of onlineFriends) {
			this.users.emitAllbyUserId(friend.id, "updateOnlineFriend", {
				id: user.id,
				userName: user.userName,
				status: newStatus,
			});
		}
	}

	createGame() {
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
		socketsPair.first.forEach((client) => {
			client.join(newRoom);
		});
		socketsPair.second.forEach((client) => {
			client.join(newRoom);
		});
		this.changeUserStatus(usersPair.first, true);
		this.changeUserStatus(usersPair.second, true);
		return this.ongoing.addGame(newRoom, usersPair.first, usersPair.second);
	}

	endGame(room: string) {
		const game = this.ongoing.getGameById(room);
		const usersPair: Pair<User> = {
			first: this.users.getUserByUserId(game.ownerId),
			second: this.users.getUserByUserId(game.playerId),
		};
		const socketsPair: Pair<Map<string, Socket>> = {
			first: this.users.getClientsByUserId(game.ownerId),
			second: this.users.getClientsByUserId(game.playerId),
		};
		this.io
			.to(room)
			.emit(
				"gameEnded",
				game.ownerScore === GAME_LIMIT_SCORE ? game.ownerId : game.playerId,
			);
		socketsPair.first.forEach((client) => {
			client.leave(room);
		});
		socketsPair.second.forEach((client) => {
			client.leave(room);
		});
		this.changeUserStatus(usersPair.first, false);
		this.changeUserStatus(usersPair.second, false);
		this.ongoing.removeGame(room);
	}

	@SubscribeMessage("showUsers")
	showUsers() {
		this.users.showOnlineUsers();
	}

	@SubscribeMessage("showGames")
	showGames() {
		this.ongoing.showGames();
	}

	@SubscribeMessage("joinQueue")
	handleJoinQueue(@ConnectedSocket() client: Socket): void {
		const user = this.users.getUserByClientId(client.id);
		const clients = this.users.getClientsByClientId(client.id);
		if (!this.queue.alreadyQueued(user.id)) {
			try {
				this.queue.enqueue(user.id);
				this.logger.log(`${user.userName} joined queue.`);
				this.logger.log(`${this.queue.size()} user(s) queued.`);
				this.users.emitAllbyUserId(user.id, "queuedStatus", true);
			} catch (e) {
				this.users.emitAllbyUserId(user.id, "queuedStatus", false);
			}
		} else {
			this.users.emitAllbyUserId(user.id, "queuedStatus", true);
			this.logger.log(`${user.userName} already queued.`);
		}
		if (this.queue.size() === 2) {
			const room = this.createGame();
			this.io
				.to(room.id)
				.emit("joinedGame", room.id, room.ownerId, room.playerId);
			this.logger.log(
				`Game launched: ${
					this.ongoing.getGameById(room.id).owner.userName
				} vs ${user.userName}.`,
			);
		}
	}

	@SubscribeMessage("leaveQueue")
	handleLeaveQueue(@ConnectedSocket() client: Socket): void {
		const user = this.users.getUserByClientId(client.id);
		if (this.queue.alreadyQueued(user.id)) {
			this.queue.dequeueUser(user.id);
			this.logger.log(`${user.userName} left queue.`);
			this.logger.log(`${this.queue.size()} user(s) queued.`);
			this.users.emitAllbyUserId(user.id, "leftQueue", undefined);
		}
		// else this.users.emitAllbyUserId(user.id, "notInQueue", undefined);
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
