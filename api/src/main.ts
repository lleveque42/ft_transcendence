import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);
	app.enableCors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
		exposedHeaders: ["WWW-Authenticate"],
	});
	await app.listen(3000);
}
bootstrap();
