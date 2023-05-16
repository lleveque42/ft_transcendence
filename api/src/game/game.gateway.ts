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
import {
	DISCONNECTION_TIMEOUT,
	GAME_LIMIT_SCORE,
	OngoingGames,
} from "../classes/OngoingGames";

@WebSocketGateway(8001, { namespace: "game", cors: "http://localhost:3001" })
export class GameGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private readonly logger = new Logger(GameGateway.name);
	@WebSocketServer()
	io: Namespace;
	reconnecting: boolean = false;
	users: OnlineUsers = new OnlineUsers();
	queue: GameQueue = new GameQueue();
	ongoing: OngoingGames = new OngoingGames();
	waitingReconnection: Map<number, string> = new Map<number, string>();
	constructor(private userService: UserService) {}

	afterInit(): any {
		this.logger.log("Websocket GameGateway initialized.");
	}

	connectInGame(client: Socket, user: User) {
		const room = this.ongoing.getGameIdByUserId(user.id);
		const game = this.ongoing.getGameById(room);
		const opponent = game.ownerId === user.id ? game.player : game.owner;
		client.join(room);
		client.emit(
			"connectionStatus",
			{ success: true, inGame: true },
			{
				room: game.id,
				ownerId: game.ownerId,
				playerId: game.playerId,
				ownerScore: game.ownerScore,
				playerScore: game.playerScore,
			},
		);
		this.users.emitAllbyUserId(opponent.id, "reconnection", undefined);
	}

	handleInGameDisconnect(user: User, client: Socket) {
		const room = this.ongoing.getGameIdByUserId(user.id);
		const game = this.ongoing.getGameById(room);
		this.waitingReconnection.set(user.id, room);
		const opponent = game.ownerId === user.id ? game.player : game.owner;
		if (this.waitingReconnection.get(opponent.id)) {
			this.logger.log(
				`${game.owner.userName} vs ${game.player.userName} : both players deconnected, game ended.`,
			);
			this.endGame(room, false);
			this.waitingReconnection.delete(opponent.id);
			this.waitingReconnection.delete(user.id);
			return;
		}
		this.io.to(room).emit("disconnection");
		setTimeout(() => {
			if (this.waitingReconnection.has(user.id)) {
				this.waitingReconnection.delete(user.id);
				this.logger.log(
					`${game.owner.userName} vs ${game.player.userName} : ended (Reconnection timeout), ${opponent.userName} won.`,
				);
				this.endGame(room, false, opponent.id);
				this.changeUserStatus(user, false);
			}
			this.users.removeClientId(client.id);
		}, DISCONNECTION_TIMEOUT);
	}

	handleDisconnect(@ConnectedSocket() client: Socket) {
		const user: User = this.users.getUserByClientId(client.id);
		if (!user) return;
		if (this.ongoing.alreadyInGame(user.id))
			this.handleInGameDisconnect(user, client);
		else {
			if (this.queue.alreadyQueued(user.id)) {
				this.queue.dequeueUser(user.id);
				this.logger.log(`${user.userName} left queue.`);
				this.logger.log(`${this.queue.size()} user(s) queued.`);
			}
			this.users.removeClientId(client.id);
		}
		this.logger.log(`Client ${client.id} (${user.userName}) disconnected.`);
		this.logger.log(`${this.users.size} user(s) connected.`);
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
			client.emit("connectionFail");
			client.disconnect();
			return;
		}
		if (this.waitingReconnection.get(user.id)) {
			this.waitingReconnection.delete(user.id);
			this.reconnecting = true;
		}
		if (this.users.hasByUserId(user.id))
			this.users.addClientToUserId(user.id, client);
		else this.users.addNewUser(user, client);
		this.logger.log(`Client ${client.id} (${user.userName}) connected.`);
		this.logger.log(`${this.users.size} user(s) connected.`);
	}

	async changeUserStatus(user: User, inGame: boolean) {
		const newStatus = inGame ? UserStatus.INGAME : UserStatus.ONLINE;
		await this.userService.changeUserStatus(user.id, newStatus);
		this.users.updateStatus(user.id, newStatus);
		const onlineFriends = await this.users.getFriendsOfByUserId(
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
			first: this.users.getUserByUserId(idPair.first.userId),
			second: this.users.getUserByUserId(idPair.second.userId),
		};
		const newRoom: string = randomUUID();
		this.users.joinAllbyUserId(idPair.first.userId, newRoom);
		this.users.joinAllbyUserId(idPair.second.userId, newRoom);
		this.changeUserStatus(usersPair.first, true);
		this.changeUserStatus(usersPair.second, true);
		return this.ongoing.addGame(newRoom, usersPair.first, usersPair.second);
	}

	endGame(room: string, finished: boolean, winnerId?: number) {
		const game = this.ongoing.getGameById(room);
		const usersPair: Pair<User> = {
			first: this.users.getUserByUserId(game.ownerId),
			second: this.users.getUserByUserId(game.playerId),
		};
		if (finished) {
			winnerId =
				game.ownerScore === GAME_LIMIT_SCORE ? game.ownerId : game.playerId;
			const winnerUsername =
				usersPair.first.id === winnerId
					? usersPair.first.userName
					: usersPair.second.userName;
			this.io.to(room).emit("gameEnded", winnerId);
			this.logger.log(
				`${usersPair.first.userName} vs ${usersPair.second.userName} : ended ${winnerUsername} won.`,
			);
			this.users.leaveAllbyUserId(usersPair.first.id, room);
			this.users.leaveAllbyUserId(usersPair.second.id, room);
			this.changeUserStatus(usersPair.first, false);
			this.changeUserStatus(usersPair.second, false);
		} else {
			this.io.to(room).emit("gameEnded", winnerId);
			this.users.leaveAllbyUserId(winnerId, room);
			this.changeUserStatus(this.users.getUserByUserId(winnerId), false);
		}
		// post game to db
		this.ongoing.removeGame(room);
	}

	@SubscribeMessage("showUsers")
	showUsers() {
		console.log("GAME SOCKET :");
		this.users.showOnlineUsers();
	}

	@SubscribeMessage("showGames")
	showGames() {
		this.ongoing.showGames();
	}

	@SubscribeMessage("getConnectionStatus")
	sendConnectionStatus(@ConnectedSocket() client: Socket) {
		setTimeout(() => {}, 200);
		const user = this.users.getUserByClientId(client.id);
		if (!user) client.emit("connectionStatusError");
		else if (
			!this.reconnecting &&
			this.users.getClientsByClientId(client.id).size > 1
		)
			client.emit("connectionStatus", { success: false, inGame: false });
		else if (this.ongoing.alreadyInGame(user.id))
			this.connectInGame(client, user);
		else client.emit("connectionStatus", { success: true, inGame: false });
	}

	@SubscribeMessage("joinQueue")
	handleJoinQueue(@ConnectedSocket() client: Socket): void {
		const user = this.users.getUserByClientId(client.id);
		if (!this.queue.alreadyQueued(user.id)) {
			try {
				this.queue.enqueue({ client: client.id, userId: user.id });
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
			const game = this.createGame();
			this.io
				.to(game.id)
				.emit("joinedGame", game.id, game.ownerId, game.playerId);
			this.logger.log(
				`${this.ongoing.getGameById(game.id).owner.userName} vs ${
					user.userName
				} : game launched.`,
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
		@MessageBody("y") y: number,
		@MessageBody("room") room: string,
	): void {
		this.io.to(room).emit("playerPaddlePosUpdate", y);
	}

	@SubscribeMessage("updateOwnerPaddlePos")
	handleRightPaddlePosUpdate(
		@MessageBody("y") y: number,
		@MessageBody("room") room: string,
	): void {
		this.io.to(room).emit("ownerPaddlePosUpdate", y);
	}

	@SubscribeMessage("updateBallPos")
	handleBallPosUpdate(
		@MessageBody("position") position: { x: number; y: number },
		@MessageBody("room") room: string,
	): void {
		this.io.to(room).emit("ballPosUpdate", { x: position.x, y: position.y });
	}

	@SubscribeMessage("scoreUpdate")
	playerScored(
		@MessageBody("room") room: string,
		@MessageBody("ownerScored") ownerScored: boolean,
	): void {
		// console.log("SCORE UPDATE");
		this.io.to(room).emit("resetPaddles");
		this.io.to(room).emit("scoreUpdate", ownerScored);
		if (!ownerScored) {
			if (this.ongoing.playerScored(room)) this.endGame(room, true);
		} else if (this.ongoing.ownerScored(room)) this.endGame(room, true);
	}
}
