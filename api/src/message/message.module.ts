import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { UserService } from "./../user/user.service";
import { ChannelService } from "./../channel/channel.service";

@Module({
	controllers: [MessageController],
	providers: [MessageService, UserService, ChannelService],
})
export class MessageModule {}
