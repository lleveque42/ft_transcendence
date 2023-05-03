import { Body, Controller, Post } from "@nestjs/common";
import { GameService } from "./game.service";
import { createGameDto } from "./dto";

@Controller("game")
export class GameController {
	constructor(private gameService: GameService) {}

	// @Post("joinGame")
	// joinGame(@S) {
//
	// }

	@Post("createGame")
	createGame(@Body() dto: createGameDto) {
		//
	}
}
