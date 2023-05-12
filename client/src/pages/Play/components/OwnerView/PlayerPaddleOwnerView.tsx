import React, { useEffect } from "react";
import {
	BALL_RADIUS,
	MAP_DEPTH,
	PADDLE_HEIGHT,
	PADDLE_WIDTH,
	PADDLE_X,
} from "../GameUtils/Constant";
import { Socket } from "socket.io-client";

interface PlayerPaddleProps {
	paddle: React.MutableRefObject<
		THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
	>;
	socket: Socket | null;
}

export default function PlayerPaddle({ paddle, socket }: PlayerPaddleProps) {
	useEffect(() => {
		socket!.on("resetPaddles", () => {
			paddle.current.position.y = 0;
		});
		socket!.on("playerPaddlePosUpdate", (y: number) => {
			paddle.current.position.y = y;
		});
		return () => {
			socket!.off("playerPaddlePosUpdate");
			socket!.off("resetPaddles");
		};
	});

	return (
		<mesh position={[-PADDLE_X - BALL_RADIUS, 0, 0]} ref={paddle}>
			<boxGeometry args={[PADDLE_WIDTH, PADDLE_HEIGHT, MAP_DEPTH]} />
			<meshStandardMaterial color="#74b9ff" />
		</mesh>
	);
}
