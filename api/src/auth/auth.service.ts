import {
	ForbiddenException,
	HttpException,
	HttpStatus,
	Injectable,
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
		let user = await this.userService.getUserByEmail(dto.email);
		if (user) {
			console.log("SIGNUP USER ALREADY EXIST : ", user.email);
			throw new ForbiddenException("Credentials taken.");
		} else {
			if ((await this.userService.getUserByUserName(dto.userName)) != null) {
				dto.userName += "_";
			}
			const hash = await argon.hash(dto.password);
			user = await this.prisma.user.create({
				data: {
					hash,
					email: dto.email,
					userName: dto.userName,
				},
			});
			console.log("SIGNUP USER CREATED : ", user.userName);
			res.status(HttpStatus.CREATED);
		}
		const token = await this.signToken(user.id, user.email);
		this.createCookieAuth(token.access_token, res);
	}

	async login(dto: SigninDto, res: Response) {
		const user = await this.userService.getUserByUserName(dto.userName);
		if (user) {
			const match = await argon.verify(user.hash, dto.password);
			if (!match) throw new ForbiddenException("Credentials incorrect.");
			const token = await this.signToken(user.id, user.email);
			this.createCookieAuth(token.access_token, res);
		} else {
			throw new ForbiddenException("Credentials incorrect.");
		}
	}

	async login42(user: User, res: Response) {
		const token = await this.signToken(user.id, user.email);
		this.createCookieAuth(token.access_token, res);
	}

	logout(res: Response) {
		res.clearCookie("_jwt");
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

	async manageNewAuth42(newUser: userInfo42Dto, res: Response) {
		let user = await this.userService.getUserByEmail(newUser.email);
		if (user) {
			console.log("USER ALREADY EXIST : ", user.userName);
			res.status(HttpStatus.OK);
		} else {
			if ((await this.userService.getUserByUserName(newUser.login)) != null) {
				newUser.login += "_";
			}
			user = await this.userService.createUser(newUser);
			console.log("USER CREATED : ", user.userName);
			res.status(HttpStatus.CREATED);
		}
		await this.login42(user, res);
	}

	////////////////////////////////// JWT

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
			expiresIn: "1d",
			secret,
		});
		return { access_token: token };
	}

	createCookieAuth(token: string, res: Response) {
		res.cookie("_jwt", token, {
			sameSite: "strict",
			secure: true,
			maxAge: 36000000, // 10h
		});
	}
}
