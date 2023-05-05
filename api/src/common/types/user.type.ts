import { User as PrismaUser, UserStatus } from '@prisma/client';

export type User = PrismaUser & { status: UserStatus };

export type UserDataRefresh = {
	userName: string;
	email: string;
	firstName: string;
	lastName: string;
	isTfaEnable: boolean;
	status: UserStatus;
	friends: { userName: string }[];
};
