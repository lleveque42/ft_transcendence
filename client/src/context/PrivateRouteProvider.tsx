import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

interface PrivateRouteSocketContextType {
	socket: Socket | null;
	chatSocket : Socket | null;
}

export const PrivateRouteSocketContext =
	createContext<PrivateRouteSocketContextType>({
		socket: null,
		chatSocket: null,
	});

export function usePrivateRouteSocket() {
	return useContext(PrivateRouteSocketContext);
}
