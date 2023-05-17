import { UserDataState } from "../../../context";
import { MapStatus } from "../enums/MapStatus";

export type GameStatus = {
	room: string;
	ownerId: number;
	playerId: number;
	owner: boolean;
	waitingToStart: boolean;
	started: boolean;
	paused: boolean;
	ended: boolean;
	ownerScore: number;
	playerScore: number;
	map: MapStatus;
	accelerator: boolean;
};

export const defaultGameStatus: GameStatus = {
	room: "",
	ownerId: 0,
	playerId: 0,
	owner: false,
	waitingToStart: false,
	started: false,
	paused: false,
	ended: false,
	ownerScore: 0,
	playerScore: 0,
	map: MapStatus.default,
	accelerator: false,
};

export function incrementOwnerScore(gameStatus: GameStatus): GameStatus {
	return { ...gameStatus, ownerScore: gameStatus.ownerScore + 1 };
}

export function incrementPlayerScore(gameStatus: GameStatus): GameStatus {
	return { ...gameStatus, playerScore: gameStatus.playerScore + 1 };
}

export function gameStarted(gameStatus: GameStatus): GameStatus {
	return { ...gameStatus, waitingToStart: false, started: true };
}

export function gameEnded(gameStatus: GameStatus): GameStatus {
	return { ...gameStatus, started: false, ended: true };
}

export function gamePaused(gameStatus: GameStatus): GameStatus {
	return { ...gameStatus, paused: true };
}

export function gameUnpaused(gameStatus: GameStatus): GameStatus {
	return { ...gameStatus, paused: false };
}

export function alreadyInGame(
	gameStatus: GameStatus,
	user: UserDataState,
	room: string,
	ownerScore: number,
	playerScore: number,
	ownerId: number,
	playerId: number,
	map: number,
	accelerator: boolean,
): GameStatus {
	const owner: boolean = user.id === ownerId;
	return {
		...gameStatus,
		room,
		ownerId,
		playerId,
		owner,
		started: true,
		ownerScore,
		playerScore,
		map,
		accelerator,
	};
}

export function joinedGame(
	gameStatus: GameStatus,
	user: UserDataState,
	room: string,
	ownerId: number,
	playerId: number,
): GameStatus {
	const owner: boolean = user.id === ownerId;
	return {
		...gameStatus,
		room,
		ownerId,
		playerId,
		owner,
		waitingToStart: true,
	};
}
