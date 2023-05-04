import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

interface ChatSocketContextType {
	socket: Socket | null;
}

export const ChatSocketContext =
	createContext<ChatSocketContextType>({
		socket: null,
	});

export function useChatSocket() {
	return useContext(ChatSocketContext);
}
