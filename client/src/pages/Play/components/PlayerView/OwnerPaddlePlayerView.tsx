import React, { useEffect } from "react";
import {
	BALL_RADIUS,
	MAP_DEPTH,
	PADDLE_HEIGHT,
	PADDLE_WIDTH,
	PADDLE_X,
} from "../GameUtils/Constant";
import { Socket } from "socket.io-client";

interface OwnerPaddleProps {
	paddle: React.MutableRefObject<
		THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
	>;
	socket: Socket | null;
}

export default function OwnerPaddle({ paddle, socket }: OwnerPaddleProps) {
	useEffect(() => {
		socket!.on("ownerPaddlePosUpdate", (data: {y: number}) => {
			paddle.current.position.y = data.y;
		});
		return () => {
			socket!.off("ownerPaddlePosUpdate");
		};
	});

	return (
		<mesh position={[PADDLE_X + BALL_RADIUS, 0, 0]} ref={paddle}>
			<boxGeometry args={[PADDLE_WIDTH, PADDLE_HEIGHT, MAP_DEPTH]} />
			<meshStandardMaterial color="#74b9ff" />
		</mesh>
	);
}
