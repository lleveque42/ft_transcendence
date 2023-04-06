import { Canvas } from "@react-three/fiber";
import LeftPaddle from "./GameComponents/LeftPaddle";
import RightPaddle from "./GameComponents/RightPaddle";
import Ball from "./GameComponents/Ball";
import { GameContext } from "../../Context/Game/GameContext";
import { useState } from "react";
import { BALL_RADIUS, PADDLE_X } from "./Constant";

export default function GameRender() {
	const [leftPaddlePosY, setLeftPaddlePosY] = useState(0);
	const [rightPaddlePosY, setRightPaddlePosY] = useState(0);
	const [mustReset, setMustReset] = useState(false);

	return (
		<Canvas>
			<ambientLight intensity={0.2} />
			<pointLight position={[0, 5, 10]} />
			<group>
				<GameContext.Provider
					value={{
						leftPaddlePosY,
						setLeftPaddlePosY,
						rightPaddlePosY,
						setRightPaddlePosY,
						mustReset,
						setMustReset,
					}}
				>
					<LeftPaddle position={[-PADDLE_X - BALL_RADIUS, 0, 0]} />
					<Ball />
					<RightPaddle position={[PADDLE_X + BALL_RADIUS, 0, 0]} />
				</GameContext.Provider>
			</group>
		</Canvas>
	);
}
