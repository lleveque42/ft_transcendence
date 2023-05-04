import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

interface GameSocketContextType {
	gameSocket: Socket | null;
}

export const GameSocketContext =
	createContext<GameSocketContextType>({
		gameSocket: null,
	});

export function useGameSocket() {
	return useContext(GameSocketContext);
}
