import {
	IsString,
	IsNotEmpty,
	IsAlphanumeric,
	IsNumber,
} from "class-validator";

export class ChannelDto {
	@IsNotEmpty()
	@IsAlphanumeric()
	title: string;

	// @IsNotEmpty()
	// @IsNumber()
	// ownerId: number;

	@IsString()
	@IsNotEmpty()
	type: string;
}

export class UserLoginDto {
	@IsString()
	@IsNotEmpty()
	login: string;
}
