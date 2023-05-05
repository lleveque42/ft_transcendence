import { Canvas } from "@react-three/fiber";
import LeftPaddle from "./PlayerPaddleOwnerView";
import RightPaddle from "./OwnerPaddleOwnerView";
import Ball from "./BallOwnerView";
import { useRef } from "react";
import Background from "../Game/Background";
import { useGameSocket } from "../../context/GameSocketProvider";

interface OwnerGameRenderProps {
	ballStopped: boolean;
	room: string;
}

export default function OwnerGameRender({
	ballStopped,
	room,
}: OwnerGameRenderProps) {
	const playerPaddle = useRef<THREE.Mesh>(null!);
	const ownerPaddle = useRef<THREE.Mesh>(null!);
	const { gameSocket } = useGameSocket();

	return (
		<Canvas camera={{ position: [0, 0, 2] }}>
			<ambientLight intensity={0.2} />
			<pointLight position={[0, 0.75, 1]} />
			<group>
				<Background />
				<LeftPaddle paddle={playerPaddle} socket={gameSocket} />
				<Ball
					ballStopped={ballStopped}
					playerPaddle={playerPaddle}
					ownerPaddle={ownerPaddle}
					socket={gameSocket}
					room={room}
				/>
				<RightPaddle paddle={ownerPaddle} socket={gameSocket} room={room} />
			</group>
		</Canvas>
	);
}
