import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BALL_RADIUS } from "../GameUtils/Constant";

import { Socket } from "socket.io-client";
import { ClientToWebsocketEvents } from "../OwnerViewComponents/OwnerGameRender";

interface BallProps {
	ballStopped: boolean;
	playerPaddle: React.MutableRefObject<
		THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
	>;
	ownerPaddle: React.MutableRefObject<
		THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
	>;
	points: { left: number; right: number };
	setPoints: React.Dispatch<
		React.SetStateAction<{ left: number; right: number }>
	>;
	socket: React.MutableRefObject<Socket<ClientToWebsocketEvents>>;
}

export default function Ball({
	ballStopped,
	playerPaddle,
	ownerPaddle,
	points,
	setPoints,
	socket,
}: BallProps) {
	const ball = useRef<THREE.Mesh>(null!);

	useFrame((state, delta) => {
		// RENDER BALL FROM SOCKET
	});

	return (
		<mesh position={[0, 0, 0]} ref={ball}>
			<sphereGeometry args={[BALL_RADIUS]} />

			{/* <boxGeometry args={[0.1, 0.1, 0.1]} /> */}
			<meshStandardMaterial color="#74b9ff" />
		</mesh>
	);
}
