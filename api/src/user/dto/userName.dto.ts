import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UserNameDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(30)
	username: string;
}
