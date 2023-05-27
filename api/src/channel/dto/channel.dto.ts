import {
	IsNotEmpty,
	IsNumber,
	IsString,
	IsDate,
	IsObject,
} from "class-validator";

export class createDmDto {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@IsString()
	mode: string;

	@IsString()
	password: string;

	@IsNotEmpty()
	@IsString()
	type: string;

	@IsNotEmpty()
	@IsNumber()
	id1: number;

	@IsNotEmpty()
	@IsNumber()
	id2: number;
}

export class titleDmDto {
	@IsNotEmpty()
	@IsString()
	title: string;
}

export class userNameDto {
	@IsNotEmpty()
	@IsString()
	username: string;
}
export class titleDto {
	@IsNotEmpty()
	@IsString()
	title: string;
}

export class NewChannelDto {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@IsString()
	mode: string;

	@IsString()
	password: string;

	@IsNotEmpty()
	@IsString()
	type: string;

	@IsNotEmpty()
	@IsString()
	username: string;
}

export class EditChannelDto {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@IsString()
	type: string;

	@IsNotEmpty()
	@IsString()
	mode: string;

	@IsString()
	password: string;

	@IsNotEmpty()
	@IsString()
	oldTitle: string;
}

export class LeaveChannelDto {
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsNotEmpty()
	@IsString()
	room: string;

	@IsNotEmpty()
	@IsString()
	userName: string;
}
export class BanOrKickDto {
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsNotEmpty()
	@IsString()
	userName: string;
}
export class MuteDto {
	@IsNotEmpty()
	@IsNumber()
	chanId: number;

	@IsNotEmpty()
	@IsNumber()
	userId: number;

	@IsNotEmpty()
	mutedEnd: any;
}
export class AdminDto {
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsNotEmpty()
	@IsString()
	userName: string;
}
export class JoinDto {
	@IsNotEmpty()
	@IsNumber()
	userId: number;

	@IsNotEmpty()
	@IsNumber()
	channelId: number;
}
export class RetrieveInviteListDto {
	@IsNotEmpty()
	@IsString()
	title: string;
}

export class AddInviteDto {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@IsNumber()
	userId: number;
}

export class SecretDto {
	@IsNotEmpty()
	@IsString()
	secret: string;

	@IsNotEmpty()
	@IsNumber()
	chanId: number;
}
