import { Module } from "@nestjs/common";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";
import { UserService } from "./../user/user.service";

@Module({
	controllers: [ChannelController],
	providers: [ChannelService, UserService],
})
export class ChannelModule {}
