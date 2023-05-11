import { UserDataState } from "../../../context";

export type GameStatus = {
	room: string;
	ownerId: number;
	playerId: number;
	owner: boolean;
	ballServer: boolean;
	waitingToStart: boolean;
	started: boolean;
	ended: boolean;
	ownerScore: number;
	playerScore: number;
};

export const defaultGameStatus: GameStatus = {
	room: "",
	ownerId: 0,
	playerId: 0,
	owner: false,
	ballServer: false,
	waitingToStart: false,
	started: false,
	ended: false,
	ownerScore: 0,
	playerScore: 0,
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
	return {
		...gameStatus,
		started: false,
		ended: true,
	};
}

export function alreadyInGame(
	gameStatus: GameStatus,
	user: UserDataState,
	room: string,
	ownerScore: number,
	playerScore: number,
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
		started: true,
		ownerScore,
		playerScore,
	};
}

export function joinedGame(
	gameStatus: GameStatus,
	user: UserDataState,
	room: string,
	ownerId: number,
	playerId: number,
	ballServer: boolean,
): GameStatus {
	const owner: boolean = user.id === ownerId;
	return {
		...gameStatus,
		room,
		ownerId,
		playerId,
		owner,
		ballServer,
		waitingToStart: true,
	};
}
