import { createContext, useContext } from "react";

export type GameContent = {
	leftPaddlePosY: number;
	setLeftPaddlePosY: (pos: number) => void;
	rightPaddlePosY: number;
	setRightPaddlePosY: (pos: number) => void;
	mustReset: boolean;
	setMustReset: (value: boolean) => void;
};

export const GameContext = createContext<GameContent>({
	leftPaddlePosY: 0,
	setLeftPaddlePosY: () => {},
	rightPaddlePosY: 0,
	setRightPaddlePosY: () => {},
	mustReset: false,
	setMustReset: () => {},
});

export const useGameContext = () => useContext(GameContext);
