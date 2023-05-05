import { User } from "@prisma/client";
import { Queue } from "./interfaces/Queue";
import { GameType } from "./types/GameType";
import { Pair } from "./types/Pair";

const LIMIT_SCORE: number = 1;

export class OngoingGames {
	private _games: Map<string, GameType>;

	constructor() {
		this._games = new Map<string, GameType>();
	}

	addGame(room: string, owner: User, player: User): void {
		this._games.set(room, {
			owner,
			ownerId: owner.id,
			player,
			playerId: player.id,
			ownerScore: 0,
			playerScore: 0,
		});
	}

	removeGame(room: string): void {
		this._games.delete(room);
	}

	getGameById(room: string): GameType | undefined {
		return this._games.get(room);
	}

	playerScored(room: string): boolean {
		this._games.get(room).playerScore++;
		return this._games.get(room).playerScore === LIMIT_SCORE;
	}

	ownerScored(room: string): boolean {
		this._games.get(room).ownerScore++;
		return this._games.get(room).ownerScore === LIMIT_SCORE;
	}

	getScore(room: string): Pair<number> {
		return {
			first: this._games.get(room).ownerScore,
			second: this._games.get(room).playerScore,
		};
	}
}
