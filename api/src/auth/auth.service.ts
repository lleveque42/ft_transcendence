import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,
	) {}

	//inscription
	async signup(dto: AuthDto) {
		try {
			const hash = await argon.hash(dto.hash);
			const user = await this.prisma.user.create({
				data: {
					hash,
					email: dto.email,
					userName: dto.userName,
					lastName: dto.lastName,
					firstName: dto.firstName,
				},
			});
			return this.signToken(user.id, user.email);
		} catch (e) {
			console.log(e);
			throw new ForbiddenException("Credentials taken.");
		}
	}

	// async signin() {}

	async signToken(
		userId: number,
		email: string,
	): Promise<{ access_token: string }> {
		const payload = {
			sub: userId,
			email,
		};
		const secret = this.config.get("JWT_SECRET");
		// const secret = "secret";
		const token = await this.jwt.signAsync(payload, {
			expiresIn: "365d",
			secret,
		});
		return { access_token: token };
	}
}
