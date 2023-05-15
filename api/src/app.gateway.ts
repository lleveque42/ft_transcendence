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
import { User, UserStatus } from "@prisma/client";
import { OnlineUsers } from "./classes/OnlineUsers";

const DISCONNECTION_STATUS_TIMEOUT = 2000;

@WebSocketGateway(8001, { cors: "*" })
export class AppGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private readonly logger = new Logger(AppGateway.name);
	@WebSocketServer()
	io: Namespace;
	users: OnlineUsers = new OnlineUsers();
	waitingReconnection: Set<number> = new Set<number>();

	constructor(private userService: UserService) {}

	afterInit(): any {
		this.logger.log("Websocket AppGateway initialized.");
	}

	async changeUserStatus(user: User, online: boolean) {
		const newStatus = online ? UserStatus.ONLINE : UserStatus.OFFLINE;
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

	async handleDisconnect(client: Socket) {
		const user: User = this.users.getUserByClientId(client.id);
		if (!user) return;
		if (this.users.getClientsByUserId(user.id).size === 1) {
			this.waitingReconnection.add(user.id);
			setTimeout(async () => {
				if (this.waitingReconnection.has(user.id)) {
					this.waitingReconnection.delete(user.id);
					await this.changeUserStatus(user, false);
				}
				this.users.removeClientId(client.id);
				this.logger.log(
					`WS Client ${client.id} (${user.userName}) disconnected !`,
				);
				this.logger.log(`${this.users.size} user(s) connected !`);
			}, DISCONNECTION_STATUS_TIMEOUT);
		} else {
			this.users.removeClientId(client.id);
			this.logger.log(
				`WS Client ${client.id} (${user.userName}) disconnected !`,
			);
			this.logger.log(`${this.users.size} user(s) connected !`);
		}
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
		if (this.waitingReconnection.has(user.id))
			this.waitingReconnection.delete(user.id);
		if (this.users.hasByUserId(user.id))
			this.users.addClientToUserId(user.id, client);
		else {
			this.users.addNewUser(user, client);
			await this.changeUserStatus(user, true);
		}
		this.logger.log(`Client ${client.id} (${user.userName}) connected.`);
		this.logger.log(`${this.users.size} user(s) connected.`);
	}

	@SubscribeMessage("showUsers")
	showUsers(@ConnectedSocket() client: Socket) {
		console.log("APP SOCKET :");
		this.users.showOnlineUsers();
	}

	@SubscribeMessage("askUserStatus")
	async askUserStatus(
		@ConnectedSocket() client: Socket,
		@MessageBody() userName: string,
	) {
		const user = await this.userService.getUserByUserName(userName);
		if (!user) client.emit("getUserStatus", null);
		else client.emit("getUserStatus", user.status);
	}

	@SubscribeMessage("userNameUpdated")
	async userNameUpdated(
		@ConnectedSocket() client: Socket,
		@MessageBody() newUserName: string,
	) {
		const user = this.users.getUserByClientId(client.id);

		// const users = this.users.getUsers();
		// console.log(users);

		// const onlineFriends = await this.users.getFriendsOfByUserId(
		// 	user.id,
		// 	this.userService,
		// );
		// for (let friend of onlineFriends) {
		// 	this.users.emitAllbyUserId(friend.id, "updateOnlineFriend", {
		// 		id: user.id,
		// 		userName: newUserName,
		// 		status: user.status,
		// 	});
		// }

		this.io.emit("userNameUpdated", {
			id: user.id,
			userName: newUserName,
			status: user.status,
		});
	}
}
