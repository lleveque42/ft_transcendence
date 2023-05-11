import { User } from "@prisma/client";

export type GameType = {
	id: string;
	owner: User;
	ownerId: number;
	ownerClient: string,
	player: User;
	playerId: number;
	ownerScore: number;
	playerScore: number;
};
