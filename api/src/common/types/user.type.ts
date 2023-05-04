export type UserDataRefresh = {
	userName: string;
	email: string;
	firstName: string;
	lastName: string;
	isTfaEnable: boolean;
	friends: { userName: string }[];
};
