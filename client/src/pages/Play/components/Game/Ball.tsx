import React, { useEffect, useRef } from "react";
import {
	BALL_CITY_COLOR,
	BALL_DEFAULT_COLOR,
	BALL_RADIUS,
	BALL_SPACE_COLOR,
} from "../GameUtils/Constant";

import { Socket } from "socket.io-client";
import { MapStatus } from "../../enums/MapStatus";

interface BallProps {
	socket: Socket | null;
	map: MapStatus;
}

export default function Ball({ socket, map }: BallProps) {
	const ball = useRef<THREE.Mesh>(null!);
	let ballColor;

	switch (map) {
		case MapStatus.space:
			ballColor = BALL_SPACE_COLOR;
			break;
		case MapStatus.city:
			ballColor = BALL_CITY_COLOR;
			break;
		default:
			ballColor = BALL_DEFAULT_COLOR;
	}

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
			<meshStandardMaterial color={ballColor} />
		</mesh>
	);
}
