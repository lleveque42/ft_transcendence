import { User } from "@prisma/client";
import { Socket } from "socket.io";

export type UserType = {
	user: User;
	sockets: Map<string, Socket>;
}
