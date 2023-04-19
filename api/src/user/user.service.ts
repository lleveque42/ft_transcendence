import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { userInfo42Dto } from "../auth/dto";
import { User } from "@prisma/client";
import { authenticator } from "otplib";
import { toDataURL } from "qrcode";

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

	async getUserByEmail(email: string): Promise<User> {
		return await this.prisma.user.findUnique({
			where: {
				email: email,
			},
		});
	}

	async getUserByUserName(userName: string): Promise<User> {
		return await this.prisma.user.findUnique({
			where: {
				userName,
			},
		});
	}

	async createUser(newUser: userInfo42Dto): Promise<User> {
		return await this.prisma.user.create({
			data: {
				email: newUser.email,
				userName: newUser.login,
				hash: "", // to del ?
				firstName: newUser.first_name,
				lastName: newUser.last_name,
				avatar: newUser.image,
				socket: "",
			},
		});
	}

	async updateUserName(userName: string, newUserName: string): Promise<User> {
		const user = await this.getUserByUserName(userName);
		if (!user) throw new ForbiddenException("Can't find user, try again");
		const userWithSameUserName = await this.getUserByUserName(newUserName);
		if (userWithSameUserName)
			throw new ForbiddenException("This username is already taken");
		return await this.prisma.user.update({
			where: {
				email: user.email,
			},
			data: {
				userName: newUserName,
			},
		});
	}

	async setTfaSecret(userName: string, secret: string): Promise<void>  {
		await this.prisma.user.update({
			where: {
				userName,
			},
			data: {
				tfaSecret: secret,
			},
		});
	}

	async toggleTfa(userName: string, value: boolean): Promise<void> {
		await this.prisma.user.update({
			where: {
				userName,
			},
			data: {
				isTfaEnable: value,
			},
		});
	}

	async removeTfa(userName: string): Promise<void> {
		const user = await this.getUserByUserName(userName);
		if (!user) throw new ForbiddenException("Can't find user, try again");
		await this.setTfaSecret(user.userName, "");
		await this.toggleTfa(user.userName, false);
	}

	async generateTfaSecret(userName: string): Promise<string> {
		const user = await this.getUserByUserName(userName);
		if (!user) throw new ForbiddenException("Can't find user, try again");
		const secret = authenticator.generateSecret();
		const otpAuthUrl = authenticator.keyuri(
			user.email,
			"Trans-" + user.userName,
			secret,
		);
		await this.setTfaSecret(user.userName, secret);
		return otpAuthUrl;
	}

	generateQrCodeDataUrl(otpAuthUrl: string): any {
		return toDataURL(otpAuthUrl);
	}

	async isTfaCodeValid(userName: string, code: string): Promise<boolean> {
		const user = await this.getUserByUserName(userName);
		if (!user) throw new ForbiddenException("Can't find user, try again");
		return authenticator.verify({ token: code, secret: user.tfaSecret });
	}

	async dropdb(): Promise<void> { // to del
		await this.prisma.user.deleteMany({});
	}
}
