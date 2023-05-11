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

@WebSocketGateway(8001, { namespace: "game", cors: "http://localhost:3001" })
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

	connectInQueue(client: Socket) {
		console.log("INQUEUE CONNECTION");
		client.emit(
			"connectionStatus",
			{ inQueue: true, inGame: false },
			{
				room: "",
				ownerId: 0,
				playerId: 0,
				ownerScore: 0,
				playerScore: 0,
			},
		);
	}

	connectInGame(client: Socket, user: User) {
		console.log("INGAME CONNECTION");
		const room = this.ongoing.getGameIdByUserId(user.id);
		const game = this.ongoing.getGameById(room);
		client.join(room);
		client.emit(
			"connectionStatus",
			{ inQueue: false, inGame: true },
			{
				room: game.id,
				ownerId: game.ownerId,
				playerId: game.playerId,
				ownerScore: game.ownerScore,
				playerScore: game.playerScore,
			},
		);
	}

	connect(client: Socket) {
		console.log("NORMAL CONNECTION");
		client.emit(
			"connectionStatus",
			{ inQueue: false, inGame: false },
			{
				room: "",
				ownerId: 0,
				playerId: 0,
				ownerScore: 0,
				playerScore: 0,
			},
		);
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
			client.emit("connectionSuccess", false);
			client.disconnect();
			return;
		}
		if (this.users.hasByUserId(user.id))
			this.users.addClientToUserId(user.id, client);
		else this.users.addNewUser(user, client);
		this.logger.log(`WS Client ${client.id} (${user.userName}) connected !`);
		this.logger.log(`${this.users.size} user(s) connected !`);
		client.emit("connectionSuccess", true);
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
			first: this.users.getUserByUserId(idPair.first.userId),
			second: this.users.getUserByUserId(idPair.second.userId),
		};
		const newRoom: string = randomUUID();
		this.users.joinAllbyUserId(idPair.first.userId, newRoom);
		this.users.joinAllbyUserId(idPair.second.userId, newRoom);
		this.changeUserStatus(usersPair.first, true);
		this.changeUserStatus(usersPair.second, true);
		return this.ongoing.addGame(
			newRoom,
			usersPair.first,
			usersPair.second,
			idPair.first.client,
		);
	}

	endGame(room: string) {
		const game = this.ongoing.getGameById(room);
		const usersPair: Pair<User> = {
			first: this.users.getUserByUserId(game.ownerId),
			second: this.users.getUserByUserId(game.playerId),
		};
		this.io
			.to(room)
			.emit(
				"gameEnded",
				game.ownerScore === GAME_LIMIT_SCORE ? game.ownerId : game.playerId,
			);
		this.users.leaveAllbyUserId(usersPair.first.id, room);
		this.users.leaveAllbyUserId(usersPair.second.id, room);
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

	@SubscribeMessage("getConnectionStatus")
	sendConnectionStatus(@ConnectedSocket() client: Socket) {
		const user = this.users.getUserByClientId(client.id);
		if (!user) {
			client.emit("connectionStatusError");
			return;
		}
		if (this.queue.alreadyQueued(user.id)) this.connectInQueue(client);
		else if (this.ongoing.alreadyInGame(user.id))
			this.connectInGame(client, user);
		else this.connect(client);
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
				.emit(
					"joinedGame",
					game.id,
					game.ownerId,
					game.playerId,
					game.ownerClient,
				);
			this.logger.log(
				`Game launched: ${
					this.ongoing.getGameById(game.id).owner.userName
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
		@ConnectedSocket() client: Socket,
		@MessageBody("y") y: number,
		@MessageBody("room") room: string,
	): void {
		this.io.to(room).emit("playerPaddlePosUpdate", { y, senderId: client.id });
	}

	@SubscribeMessage("updateOwnerPaddlePos")
	handleRightPaddlePosUpdate(
		@ConnectedSocket() client: Socket,
		@MessageBody("y") y: number,
		@MessageBody("room") room: string,
	): void {
		this.io.to(room).emit("ownerPaddlePosUpdate", { y, senderId: client.id });
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
		this.io.to(room).emit("scoreUpdate", ownerScored);
		if (!ownerScored) {
			if (this.ongoing.playerScored(room)) this.endGame(room);
		} else if (this.ongoing.ownerScored(room)) this.endGame(room);
	}
}
