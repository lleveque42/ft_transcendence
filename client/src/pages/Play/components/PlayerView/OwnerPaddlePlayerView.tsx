import React, { useEffect } from "react";
import {
	BALL_RADIUS,
	MAP_DEPTH,
	PADDLE_HEIGHT,
	PADDLE_WIDTH,
	PADDLE_X,
	PADDLE_CITY_COLOR,
	PADDLE_DEFAULT_COLOR,
	PADDLE_SPACE_COLOR,
} from "../GameUtils/Constant";
import { Socket } from "socket.io-client";
import { MapStatus } from "../../enums/MapStatus";

interface OwnerPaddleProps {
	paddle: React.MutableRefObject<
		THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
	>;
	socket: Socket | null;
	map: MapStatus;
}

export default function OwnerPaddle({ paddle, socket, map }: OwnerPaddleProps) {
	let paddleColor;

	switch (map) {
		case MapStatus.city:
			paddleColor = PADDLE_CITY_COLOR;
			break;
		case MapStatus.space:
			paddleColor = PADDLE_SPACE_COLOR;
			break;
		default:
			paddleColor = PADDLE_DEFAULT_COLOR;
			break;
	}

	useEffect(() => {
		socket!.on("resetPaddles", () => {
			paddle.current.position.y = 0;
		});
		socket!.on("ownerPaddlePosUpdate", (y: number) => {
			paddle.current.position.y = y;
		});
		return () => {
			socket!.off("ownerPaddlePosUpdate");
			socket!.off("resetPaddles");
		};
	});

	return (
		<mesh position={[PADDLE_X + BALL_RADIUS, 0, 0]} ref={paddle}>
			<boxGeometry args={[PADDLE_WIDTH, PADDLE_HEIGHT, MAP_DEPTH]} />
			<meshStandardMaterial color={paddleColor} />
		</mesh>
	);
}
