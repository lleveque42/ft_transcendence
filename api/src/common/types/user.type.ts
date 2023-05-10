import { User as PrismaUser, UserStatus } from "@prisma/client";

export type User = PrismaUser & { status: UserStatus };

export type UserDataRefresh = {
	id: number,
	userName: string;
	email: string;
	firstName: string;
	lastName: string;
	isTfaEnable: boolean;
	status: UserStatus;
	friends: { userName: string }[];
};

export type UserInfosType = {
	userName: string;
	firstName: string;
	lastName: string;
	email: string;
	status: UserStatus;
};
