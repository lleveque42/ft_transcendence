import {
	ForbiddenException,
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { SignupDto, SigninDto, userInfo42Dto } from "./dto";
import * as argon from "argon2";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { UserService } from "../user/user.service";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,
		private userService: UserService,
	) {}

	async signup(dto: SignupDto, res: Response) {
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

	async login42(user: User) {
		// add res ? Ret ??
	}

	async getAuthToken42(code: string): Promise<string> {
		const urlToken = `https://api.intra.42.fr/oauth/token?grant_type=authorization_code&client_id=${this.config.get(
			"CLIENT_42_UID",
		)}&client_secret=${this.config.get(
			"CLIENT_42_SECRET",
		)}&code=${code}&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Flogin42`;
		const res = await fetch(urlToken, {
			method: "POST",
		});
		if (!res.ok) {
			console.error("Error getAuthToken42 :", code, res.status);
			throw new HttpException("Bad code request", HttpStatus.UNAUTHORIZED);
		}
		const token42 = await res.json();
		return token42.access_token;
	}

	async userInfo42(token42: string): Promise<userInfo42Dto> {
		const res = await fetch("https://api.intra.42.fr/v2/me", {
			headers: {
				Authorization: `Bearer ${token42}`,
			},
		});
		if (!res.ok) {
			throw new HttpException("Can't find 42 user", HttpStatus.NOT_FOUND);
		}
		const { login, email, first_name, last_name } = await res.json(); // Add avatar link ?
		return { login, email, first_name, last_name };
	}

	async manageNewAuth(newUser: userInfo42Dto, res: Response) {
		let user = await this.userService.getUserByEmail(newUser.email);
		if (user) {
			console.log("USER ALREADY EXIST : ", user.userName);
			this.login42(user);
			return res.status(HttpStatus.OK).send();
		}
		if ((await this.userService.getUserByUserName(newUser.login)) != null) {
			newUser.login += "_";
		}
		user = await this.userService.createUser(newUser);
		console.log("USER CREATED : ", user.userName);
		return res.status(HttpStatus.CREATED).json([]);
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
