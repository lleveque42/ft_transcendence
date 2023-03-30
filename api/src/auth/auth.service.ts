import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { SignupDto, SigninDto, CodeDto } from "./dto";
import * as argon from "argon2";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,
	) {}

	// AUTH ////////////////////////////////////////////////////////

	async signup(dto: SignupDto, req: Request, res: Response) {
		try {
			const hash = await argon.hash(dto.password);
			const user = await this.prisma.user.create({
				data: {
					hash,
					email: dto.email,
					userName: dto.userName,
				},
			});
			const token = await this.signToken(user.id, user.email);
			this.createCookieAuth(token.access_token, res);
			return token;
		} catch (e) {
			if (e.code === "P2002")
				throw new ForbiddenException("Credentials taken.");
			throw e;
		}
	}

	async login(dto: SigninDto, res: Response) {
		const user = await this.prisma.user.findUnique({
			where: {
				userName: dto.userName,
			},
		});
		if (!user) throw new ForbiddenException("Credentials incorrect.");
		const match = await argon.verify(user.hash, dto.password);
		if (!match) throw new ForbiddenException("Credentials incorrect.");
		const token = await this.signToken(user.id, user.email);
		this.createCookieAuth(token.access_token, res);
		return token;
	}

	// 42 ////////////////////////////////////////////////////////

	async loginFortyTwo(dto: CodeDto, res: Response) {
		console.log(dto.code);
		return "coucou";
	}

	async signToken(
		userId: number,
		email: string,
	): Promise<{ access_token: string }> {
		const payload = {
			sub: userId,
			email,
		};
		const secret = this.config.get("JWT_SECRET");
		const token = await this.jwt.signAsync(payload, {
			expiresIn: "365d",
			secret,
		});
		return { access_token: token };
	}

	async createCookieAuth(token: string, res: Response) {
		res.cookie("_jwt", token, {
			sameSite: "strict",
			secure: true,
		});
	}
}
