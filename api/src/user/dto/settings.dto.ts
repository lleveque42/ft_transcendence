import { IsString, IsNotEmpty, NotContains } from "class-validator";

export class updateUserNameDto {
	@IsNotEmpty()
	@IsString()
	@NotContains(" " || "	", {
		message: "New username should not include spaces"
	})
	newUserName: string;
}
