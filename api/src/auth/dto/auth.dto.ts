import {
	IsEmail,
	IsString,
	IsNotEmpty,
	IsNumberString,
	Length,
} from "class-validator";

export class SignupDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsNotEmpty()
	userName: string;
}

export class SigninDto {
	@IsString()
	@IsNotEmpty()
	userName: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}

export class getAuthToken42Dto {
	@IsString()
	code: string;
}

export class userInfo42Dto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsString()
	@IsNotEmpty()
	login: string;

	@IsString()
	@IsNotEmpty()
	first_name: string;

	@IsString()
	@IsNotEmpty()
	last_name: string;
}
