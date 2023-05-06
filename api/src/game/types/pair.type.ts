import { User } from "@prisma/client";
import { Socket } from "socket.io";

export type Pair<T> = {
	first: T;
	second: T;
}
