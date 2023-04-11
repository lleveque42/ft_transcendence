import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(private readonly config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				JwtStrategy.extractFromCookie,
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			ignoreExpiation: false,
			secretOrKey: config.get("JWT_SECRET"), // Check if is defined
		});
	}

	// This func assign req.user
	validate(payload: any) {
		// Need to change param type and check payload
		console.log(Date.now());
		console.log("================PAYLOAD:", payload);

		return payload;
	}

	private static extractFromCookie(req: Request): string | null {
		if (req.cookies && "_jwt" in req.cookies && req.cookies._jwt.length > 0) {
			return req.cookies._jwt;
		}
		return null;
	}
}
