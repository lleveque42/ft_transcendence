import React from "react";
import io from "socket.io-client";

export const gameSocket = io(`${process.env.REACT_APP_GAME_WEBSOCKET_URL}`);
export const gameSocketContext = React.createContext(gameSocket);
export const useGameSocketContext = () => React.useContext(gameSocketContext);
