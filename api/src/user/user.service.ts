import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getHelloUser() {
		//   const str = 'Ceci vient de la db';
		//   const user = await this.prisma.user.create({
		//     data: {
		//       email: str,
		//     },
		//   });
		//   return user.email;
	}
}
