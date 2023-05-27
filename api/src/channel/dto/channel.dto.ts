import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class createDmDto {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@IsString()
	mode: string;

	@IsString()
	password: string;

	@IsNotEmpty()
	@IsString()
	type: string;

	@IsNotEmpty()
	@IsNumber()
	id1: number;

	@IsNotEmpty()
	@IsNumber()
	id2: number;
}

export class titleDmDto {
	@IsNotEmpty()
	@IsString()
	title: string;
}
