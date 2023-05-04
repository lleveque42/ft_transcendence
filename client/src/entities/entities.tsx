interface User {
	id: number;
	email: string;
	userName: string;
	firstName?: string;
	lastName?: string;
	avatar?: string;
	socket?: string;
}

export class UserModel implements User {
	id: number;
	email: string;
	userName: string;
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
	date?: Date;
	content: string;
	authorId?: number;
	author: UserModel;
}

export class MessageModel implements Message {
	id: number;
	date?: Date;
	content: string;
	authorId?: number;
	author: UserModel;

	constructor(data: Message) {
		this.id = data.id;
		this.date = data.date;
		this.content = data.content;
		this.authorId = data.authorId;
		this.author = data.author;
	}
}
