import React, { useEffect, useRef } from "react";
import { BALL_RADIUS } from "../GameUtils/Constant";

import { Socket } from "socket.io-client";

interface BallProps {
	socket: Socket | null;
}

export default function Ball({ socket }: BallProps) {
	const ball = useRef<THREE.Mesh>(null!);

	useEffect(() => {
		socket!.on("ballPosUpdate", ({ x, y }) => {
			ball.current.position.x = x;
			ball.current.position.y = y;
		});
		return () => {
			socket!.off("ballPosUpdate");
		};
	});

	return (
		<mesh position={[0, 0, 0]} ref={ball}>
			<sphereGeometry args={[BALL_RADIUS]} />
			<meshStandardMaterial color="#74b9ff" />
		</mesh>
	);
}
