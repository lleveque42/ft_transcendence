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

	async signup(dto: SignupDto, res: Response): Promise<void> {
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
		const token = await this.signRefreshToken(
			user.id,
			user.email,
			user.createdAt,
		);
		this.createAuthCookie(token.refresh_token, res);
	}

	async login(dto: SigninDto, res: Response): Promise<void> {
		const user = await this.userService.getUserByUserName(dto.userName);
		if (user) {
			const match = await argon.verify(user.hash, dto.password);
			if (!match) throw new ForbiddenException("Credentials incorrect.");
			const token = await this.signRefreshToken(
				user.id,
				user.email,
				user.createdAt,
			);
			this.createAuthCookie(token.refresh_token, res);
		} else {
			throw new ForbiddenException("Credentials incorrect.");
		}
	}

	async login42(user: User, res: Response): Promise<void> {
		const token = await this.signRefreshToken(
			user.id,
			user.email,
			user.createdAt,
		);
		this.createAuthCookie(token.refresh_token, res);
	}

	logout(res: Response): void {
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

	async manageNewAuth42(newUser: userInfo42Dto, res: Response): Promise<void> {
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



	async test(header: string, userRt: any) {
		const decode: any = this.jwt.decode(header);
		console.log("DECODE", decode);
		console.log("USERRT", userRt);
		const user = await this.userService.getUserByEmail(userRt.email);
		console.log("USER", user);
		if (decode && user.firstName != decode.firstName) {
			console.log("BLOUP");
		} else {
			console.log("BLOUuuuuuuuP");

		}

		return decode;
	}




	////////////////////////////////// JWT

	async signRefreshToken(
		userId: number,
		email: string,
		createdAt: Date,
	): Promise<{ refresh_token: string }> {
		const payload = {
			sub: userId,
			email,
			createdAt,
		};
		const token = await this.jwt.signAsync(payload, {
			expiresIn: "1d",
			secret: this.config.get<string>("JWT_SECRET"),
		});
		return { refresh_token: token };
	}

	async signAccessToken(
		userName: string,
		firstName: string,
		lastName: string,
	): Promise<{ access_token: string }> {
		const payload = { sub: userName, firstName, lastName };
		const token = await this.jwt.signAsync(payload, {
			secret: this.config.get<string>("JWT_SECRET"),
		});
		return { access_token: token };
	}

	createAuthCookie(token: string, res: Response) {
		res.cookie("_jwt", token, {
			sameSite: "strict",
			secure: true,
			httpOnly: true,
			maxAge: 3600000, // 1h=3600000 | 10h=36000000
		});
	}
}
