import { User } from "@prisma/client";
import { Socket } from "socket.io";

interface UsersInterface {
	user: User;
	sockets: Map<string, Socket>;
}

export class OnlineUsers {
	private _users: Map<number, UsersInterface>;
	private _clients: Map<string, number>;
	size: number;

	constructor() {
		this._users = new Map<number, UsersInterface>();
		this._clients = new Map<string, number>();
		this.size = 0;
	}

	addNewUser(user: User, client: Socket): void {
		this._clients.set(client.id, user.id);
		const clientMap = new Map<string, Socket>([[client.id, client]]);
		this._users.set(user.id, {
			user,
			sockets: clientMap,
		});
		this.size++;
	}

	removeClientId(clientId: string): void {
		const userId = this._clients.get(clientId);
		this._clients.delete(clientId);
		if (userId !== undefined) {
			const userInterface: UsersInterface = this._users.get(userId);
			userInterface.sockets.delete(clientId);
			if (userInterface.sockets.size === 0) {
				this._users.delete(userId);
				this.size--;
			}
		}
	}

	hasByUserId(userId: number): boolean {
		return this._users.has(userId);
	}

	hasByClientId(clientId: string): boolean {
		return this._clients.has(clientId);
	}

	getClientsByUserId(userId: number): Map<string, Socket> {
		return this._users.get(userId).sockets || null;
	}

	getClientsByClientId(clientId: string): Map<string, Socket> | null {
		const userId = this._clients.get(clientId);
		if (userId !== undefined) return this._users.get(userId).sockets || null;
		return null;
	}

	getUserByClientId(clientId: string): User | null {
		const userId = this._clients.get(clientId);
		if (userId !== undefined) return this._users.get(userId).user;
		return null;
	}

	addClientToUserId(userId: number, client: Socket): void {
		this._clients.set(client.id, userId);
		const userInterface: UsersInterface = this._users.get(userId);
		userInterface.sockets.set(client.id, client);
	}

	showOnlineUsers() {
		console.log("CONNECTED USERS : \n");
		console.log(this._users);
		console.log("\nCONNECTED CLIENTS : \n");
		console.log(this._clients);
	}
}