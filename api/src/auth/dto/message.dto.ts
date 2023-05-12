import { User } from "@prisma/client";
import {
	IsString,
	IsNotEmpty,
	IsAlphanumeric,
	IsNumber,
} from "class-validator";

export class MessageDto {
	@IsNotEmpty()
	@IsAlphanumeric()
	title: string;

	@IsNotEmpty()
	owner: User;

	@IsNotEmpty()
	@IsNumber()
	ownerId: number;

	@IsString()
	@IsNotEmpty()
	type: string;

	@IsNotEmpty()
	operators: User[];

	@IsNotEmpty()
	members: User[];
}
