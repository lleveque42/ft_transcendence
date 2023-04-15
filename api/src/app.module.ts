import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma/prisma.service";
import { ServerGateway } from "./server/server.gateway";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { UserService } from "./user/user.service";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PrismaModule,
		UserModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService, PrismaService, ServerGateway, UserService],
})
export class AppModule {}
