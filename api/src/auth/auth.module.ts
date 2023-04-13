import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { HttpModule } from "@nestjs/axios";
import { UserService } from "../user/user.service";
import { AtStrategy, RtStrategy } from "./strategies";
@Module({
	imports: [JwtModule.register({}), HttpModule.register({})],
	controllers: [AuthController],
	providers: [AuthService, UserService, RtStrategy, AtStrategy],
})
export class AuthModule {}
