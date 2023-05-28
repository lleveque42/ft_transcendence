import { Muted } from "../../channel/classes/entities";

export type GetUserList = {
	userName: string;
	blockList: {
		userName: string;
		id: number;
	}[];
	id: number;
};

export type GetSanitizeChan = {
	id: number;
	title: string;
	type: string;
	mode: string;
	ownerId: number;
	members: {
		userName: string;
		id: number;
	}[];
	banList: {
		userName: string;
		id: number;
	}[];
	operators: {
		userName: string;
		id: number;
	}[];
	mutedList: Muted[];
	messages: {
		id: number;
		content: string;
		authorId: number;
		author: {
			id: number;
			userName: string;
		};
	}[];
};

export type GetSanitizeMessage = {
	id: number;
	content: string;
	authorId: number;
	author: {
		id: number;
		userName: string;
	};
};
