import { IsEmail, IsString, IsNotEmpty } from "class-validator";

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

export class CodeDto {
	@IsString()
	code: string;
}
