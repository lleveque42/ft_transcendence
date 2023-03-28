import { IsEmail, IsString, IsNotEmpty, IsAlpha } from "class-validator";

export class AuthDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsString()
	@IsNotEmpty()
	hash: string;

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
