import { randomUUID } from "crypto";
import { Pair } from "../game/types/pair.type";

type PrivateGamesPair = {
	id: number;
	connected: boolean;
};

export default class PrivateGames {
	private privateGames: Map<string, Pair<PrivateGamesPair>>;

	constructor() {
		this.privateGames = new Map<string, Pair<PrivateGamesPair>>();
	}

	newPrivateGame(ownerId: number, playerId: number) {
		const room = randomUUID();
		this.privateGames.set(room, {
			first: { id: ownerId, connected: false },
			second: { id: playerId, connected: false },
		});
		return room;
	}

	hasByUserId(userId: number): string {
		let room: string = "";
		this.privateGames.forEach((value, key) => {
			if (value.first.id === userId || value.second.id === userId)
				return (room = key);
		});
		return room;
	}

	getRoomByUserId(userId: number): string {
		this.privateGames.forEach((value, key) => {
			if (value.first.id === userId || value.second.id === userId) return key;
		});
		return "";
	}

	connectUser(room: string, userId: number) {
		const game = this.privateGames.get(room);
		this.privateGames.set(
			room,
			userId === game.first.id
				? { first: { id: game.first.id, connected: true }, second: game.second }
				: {
						first: game.first,
						second: { id: game.second.id, connected: true },
				  },
		);
	}

	bothConnected(room: string): boolean {
		const game = this.privateGames.get(room);
		return game.first.connected && game.second.connected;
	}

	get(room: string) {
		return this.privateGames.get(room);
	}

	deleteGame(room: string) {
		this.privateGames.delete(room);
	}
}
