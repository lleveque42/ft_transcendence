import React from "react";
import { useFrame } from "@react-three/fiber";
import {
	BALL_RADIUS,
	MAP_DEPTH,
	PADDLE_HEIGHT,
	PADDLE_WIDTH,
	PADDLE_X,
} from "../GameUtils/Constant";
import { Socket } from "socket.io-client";
import { ClientToWebsocketEvents } from "./OwnerGameRender";

interface PlayerPaddleProps {
	paddle: React.MutableRefObject<
		THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
	>;
	socket: React.MutableRefObject<Socket<ClientToWebsocketEvents>>;
}

export default function PlayerPaddle({ paddle, socket }: PlayerPaddleProps) {
	useFrame((state, delta) => {
		// RENDER PLAYER PADDLE FROM SOCKET
	});

	return (
		<mesh position={[-PADDLE_X - BALL_RADIUS, 0, 0]} ref={paddle}>
			<boxGeometry args={[PADDLE_WIDTH, PADDLE_HEIGHT, MAP_DEPTH]} />
			<meshStandardMaterial color="#74b9ff" />
		</mesh>
	);
}
