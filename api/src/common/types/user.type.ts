export type UserDataRefresh = {
	id: number,
	userName: string;
	email: string;
	firstName: string;
	lastName: string;
	isTfaEnable: boolean;
	friends: { userName: string }[];
};
