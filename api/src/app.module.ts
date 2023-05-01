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
import { ChannelModule } from "./channel/channel.module";
import { ChannelService } from "./channel/channel.service";
import { MessageService } from "./message/message.service";
import { MessageModule } from "./message/message.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PrismaModule,
		UserModule,
		AuthModule,
		ChannelModule,
		MessageModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		PrismaService,
		ServerGateway,
		UserService,
		ChannelService,
		MessageService,
	],
})
export class AppModule {}
