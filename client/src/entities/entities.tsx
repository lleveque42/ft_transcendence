interface User {
	id: number;
	userName: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	avatar?: string;
	socket?: string;
}

export class UserModel implements User {
	id: number;
	userName: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	avatar?: string;
	socket?: string;

	constructor(data: User) {
		this.id = data.id;
		this.email = data.email;
		this.userName = data.userName;
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.avatar = data.avatar;
		this.socket = data.socket;
	}
}

interface Message {
	id: number;
	// date?: Date;
	content: string;
	authorId?: number;
	author: UserModel;
}

export class MessageModel implements Message {
	id: number;
	// date?: Date;
	content: string;
	authorId?: number;
	author: UserModel;

	constructor(data: Message) {
		this.id = data.id;
		// this.date = data.date;
		this.content = data.content;
		this.authorId = data.authorId;
		this.author = data.author;
	}
}

export interface Channel {
	id: number;
	title: string;
	password?: string;
	type: string;
	mode: string;
	// owner?: User;
	ownerId?: number;
	operators: User[];
	members: User[];
	messages: Message[];
	banList: User[];
	mutedList: Muted[];
}

export class ChannelModel implements Channel {
	id: number;
	title: string;
	password?: string;
	type: string;
	mode: string;
	// owner?: UserModel;
	ownerId?: number;
	operators: UserModel[];
	members: UserModel[];
	messages: Message[];
	banList: User[];
	mutedList: Muted[];

	constructor(data: Channel) {
		this.id = data.id;
		this.title = data.title;
		this.password = data.password;
		this.type = data.type;
		this.mode = data.mode;
		this.ownerId = data.ownerId;
		//   this.owner = data.owner ? new UserModel(data.owner) : undefined;
		this.operators = data.operators.map((user) => new UserModel(user));
		this.members = data.members.map((user) => new UserModel(user));
		this.messages = data.messages;
		this.banList = data.banList;
		this.mutedList = data.mutedList;
	}
}
export interface Muted {
	id: number;
	userId: number;
	muteExpiration: Date;
}

export class MutedModel implements Muted {
	id: number;
	userId: number;
	muteExpiration: Date;

	constructor(data: Muted) {
		this.id = data.id;
		this.userId = data.userId;
		this.muteExpiration = data.muteExpiration;
	}
}
