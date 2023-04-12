import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { HttpModule } from "@nestjs/axios";
import { UserService } from "../user/user.service";
import { RtStrategy } from "./strategies";
@Module({
	imports: [JwtModule.register({}), HttpModule.register({})],
	controllers: [AuthController],
	providers: [AuthService, RtStrategy, UserService],
})
export class AuthModule {}
