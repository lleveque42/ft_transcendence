import { UserStatus } from "./UserStatus.enum";

export type GameInfosType = {
	id: number;
	opponentUsername: string;
	won: boolean;
	ownScore: number;
	playerScore: number;
};

export type UserProfileType = {
	userName: string;
	firstName: string;
	lastName: string;
	email: string;
	status: UserStatus;
	wins: number;
	losses: number;
	games: GameInfosType[];
};

export const UserProfileValues: UserProfileType = {
	userName: "",
	firstName: "",
	lastName: "",
	email: "",
	status: UserStatus.ONLINE,
	wins: 0,
	losses: 0,
	games: [],
};
