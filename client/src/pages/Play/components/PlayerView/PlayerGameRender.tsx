import { Canvas } from "@react-three/fiber";
import LeftPaddle from "./PlayerPaddlePlayerView";
import RightPaddle from "./OwnerPaddlePlayerView";
import Ball from "./BallPlayerView";
import { useRef } from "react";
import Background from "../Game/Background";
import { useGameSocket } from "../../context/GameSocketProvider";

interface PlayerGameRenderProps {
	room: string;
}

export default function PlayerGameRender({ room }: PlayerGameRenderProps) {
	const playerPaddle = useRef<THREE.Mesh>(null!);
	const ownerPaddle = useRef<THREE.Mesh>(null!);
	const { gameSocket } = useGameSocket();

	return (
		<Canvas camera={{ position: [0, 0, 2] }}>
			<ambientLight intensity={0.2} />
			<pointLight position={[0, 0.75, 1]} />
			<group>
				<Background />
				<LeftPaddle paddle={playerPaddle} socket={gameSocket} room={room} />
				<Ball socket={gameSocket} />
				<RightPaddle paddle={ownerPaddle} socket={gameSocket} />
			</group>
		</Canvas>
	);
}
