import {
	IsString,
	IsNotEmpty,
	NotContains,
	IsNumberString,
	MaxLength,
} from "class-validator";

export class updateUserNameDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(30, {
		message: "New username must be shorter than or equal to 30 characters",
	})
	@NotContains(" " || "	", {
		message: "New username should not include spaces",
	})
	newUserName: string;
}

export class tfaVerificationCode {
	@IsNotEmpty()
	@IsNumberString(null, {
		message: "Verification code must only contains digits",
	})
	code: string;
}
