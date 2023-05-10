import { User } from "@prisma/client";
import { GameType } from "../game/types/game.type";
import { Pair } from "../game/types/pair.type";

export const GAME_LIMIT_SCORE: number = 1;

export class OngoingGames {
	private _games: Map<string, GameType>;
	private _users: Set<number>;

	constructor() {
		this._games = new Map<string, GameType>();
		this._users = new Set<number>();
	}

	addGame(room: string, owner: User, player: User): GameType {
		this._games.set(room, {
			id: room,
			owner,
			ownerId: owner.id,
			player,
			playerId: player.id,
			ownerScore: 0,
			playerScore: 0,
		});
		this._users.add(owner.id);
		this._users.add(player.id);
		return this._games.get(room);
	}

	removeGame(room: string): void {
		const game: GameType = this._games.get(room);
		const usersPair: Pair<number> = {
			first: game.ownerId,
			second: game.playerId,
		};
		this._users.delete(usersPair.first);
		this._users.delete(usersPair.second);
		this._games.delete(room);
	}

	getGameById(room: string): GameType | undefined {
		return this._games.get(room);
	}

	playerScored(room: string): boolean {
		this._games.get(room).playerScore++;
		return this._games.get(room).playerScore === GAME_LIMIT_SCORE;
	}

	ownerScored(room: string): boolean {
		this._games.get(room).ownerScore++;
		return this._games.get(room).ownerScore === GAME_LIMIT_SCORE;
	}

	getScore(room: string): Pair<number> {
		return {
			first: this._games.get(room).ownerScore,
			second: this._games.get(room).playerScore,
		};
	}

	alreadyInGame(userId: number): boolean {
		return this._users.has(userId);
	}

	showGames() {
		for (let game of this._games) console.log(game);
	}
}
