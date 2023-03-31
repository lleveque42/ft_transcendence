import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { SignupDto, SigninDto, CodeDto } from "./dto";
import * as argon from "argon2";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,
		private readonly httpService: HttpService,
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

		const urlToken =
		`https://api.intra.42.fr/oauth/token?grant_type=authorization_code&client_id=${this.config.get("CLIENT_42_UID")}&client_secret=${this.config.get("CLIENT_42_SECRET")}&code=${dto.code}&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Flogin42`;
		// const token = this.httpService.post(urlToken);


		try {
			const response = await fetch(urlToken, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				console.log("OK login back 42");
				// navigate("/");
			} else {
				console.log(response);

			}
		} catch (e) {
			console.error("ERROR FETCH");
		}






		// token.subscribe((value) => console.log(value));
		// const params = {
		// grant_type: "authorization_code",
		// client_id:
		// "ID",
		// client_secret:
		// "SECRET",
		// code: dto.code,
		// redirect_uri: "http%3A%2F%2Flocalhost%3A3001%2Flogin42",
		// };
		// const response = await axios.post(
		// "https://api.intra.42.fr/oauth/token",
		// querystring.stringify(params),
		// {
		// headers: {
		// "Content-Type": "application/x-www-form-urlencoded",
		// },
		// },
		// );
		// const access_token = response.data.access_token;
		// // console.log(access_token);


		// const response = await axios.post(
		// 	"https://api.intra.42.fr/oauth/token",
		// 	querystring.stringify(params),
		// 	{
		// 		headers: {
		// 			"Content-Type": "application/x-www-form-urlencoded",
		// 		},
		// 	},
		// );
		// const access_token = response.data.access_token;
		// // 	console.log(access_token);
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
		console.log(this.config.get("CLIENT_42_UID"));

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
