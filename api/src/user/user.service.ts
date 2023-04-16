import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { userInfo42Dto } from "../auth/dto";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async setUserSocket(userName: string, socket: string) {
		await this.prisma.user.update({
			where: {
				userName: userName,
			},
			data: {
				socket: socket,
			},
		});
	}

	async getUserByEmail(email: string) {
		return await this.prisma.user.findUnique({
			where: {
				email: email,
			},
		});
	}

	async getUserByUserName(userName: string) {
		return await this.prisma.user.findUnique({
			where: {
				userName,
			},
		});
	}

	async createUser(newUser: userInfo42Dto) {
		return await this.prisma.user.create({
			data: {
				email: newUser.email,
				userName: newUser.login,
				hash: "", // to del ?
				firstName: newUser.first_name,
				lastName: newUser.last_name,
				socket: "",
			},
		});
	}

	async updateUserName(userName: string, newUserName: string) {
		const user = await this.getUserByUserName(userName);
		if (!user) {
			throw new ForbiddenException("Can't find user, try again");
		}
		const userWithSameUserName = await this.getUserByUserName(newUserName);
		if (userWithSameUserName) {
			throw new ForbiddenException("This username is already taken");
		}
		await this.prisma.user.update({
			where: {
				email: user.email,
			},
			data: {
				userName: newUserName,
			},
		});
	}

	async dropdb() {
		await this.prisma.user.deleteMany({});
	}
}
