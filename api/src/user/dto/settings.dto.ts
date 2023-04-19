import {
	IsString,
	IsNotEmpty,
	NotContains,
	IsNumberString,
} from "class-validator";

export class updateUserNameDto {
	@IsNotEmpty()
	@IsString()
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
