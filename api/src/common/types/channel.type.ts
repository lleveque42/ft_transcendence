export type GetUserList = {
	userName: string;
	blockList: {
		userName: string;
		id: number;
	}[];
	id: number;
};
