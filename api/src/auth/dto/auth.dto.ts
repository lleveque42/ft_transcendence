import { IsEmail, IsString, IsNotEmpty, IsAlpha } from "class-validator";

export class SignupDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsAlpha()
	@IsNotEmpty()
	firstName: string;

	@IsString()
	@IsAlpha()
	@IsNotEmpty()
	lastName: string;

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
