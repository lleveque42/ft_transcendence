import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class BlockUsertDto {
	@IsNotEmpty()
	@IsNumber()
	userTopId: number;

	@IsNotEmpty()
	@IsString()
	userTopName: number;

	@IsNotEmpty()
	@IsNumber()
	userBottomId: number;

	@IsNotEmpty()
	@IsString()
	userBottomName: number;
}
