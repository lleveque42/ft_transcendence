import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

interface GameSocketContextType {
	socket: Socket | null;
}

export const GameSocketContext =
	createContext<GameSocketContextType>({
		socket: null,
	});

export function useGameSocket() {
	return useContext(GameSocketContext);
}
