import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class RtGuard extends AuthGuard("jwt-refresh") {
	throwError(error: any, user: any) {
		if (error || !user) {
			if (error) throw error;
			throw new HttpException("RT guard error", HttpStatus.UNAUTHORIZED);
		}

		return user;
	}
}
