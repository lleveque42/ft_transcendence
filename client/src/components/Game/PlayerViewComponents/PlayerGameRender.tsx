import { Canvas } from "@react-three/fiber";
import LeftPaddle from "./PlayerPaddlePlayerView";
import RightPaddle from "./OwnerPaddlePlayerView";
import Ball from "./BallPlayerView";
import { useRef } from "react";
import Background from "../GameComponents/Background";
import { Socket } from "socket.io-client";

interface PlayerGameRenderProps {
	ballStopped: boolean;
	points: { left: number; right: number };
	setPoints: React.Dispatch<
		React.SetStateAction<{ left: number; right: number }>
	>;
}

export interface ClientToWebsocketEvents {
	updateOwnerPaddlePos: (y: number) => void;
	updatePlayerPaddlePos: (y: number) => void;
	updateBallPos: (position: { x: number; y: number }) => void;
}

// interface WebsocketToClientEvents {}

export default function PlayerGameRender({
	ballStopped,
	points,
	setPoints,
}: PlayerGameRenderProps) {
	const playerPaddle = useRef<THREE.Mesh>(null!);
	const ownerPaddle = useRef<THREE.Mesh>(null!);
	const socket = useRef<Socket<ClientToWebsocketEvents>>(null!);

	return (
			<Canvas camera={{ position: [0, 0, 2] }}>
				<ambientLight intensity={0.2} />
				<pointLight position={[0, 0.75, 1]} />
				<group>
					<Background />
					<LeftPaddle paddle={playerPaddle} socket={socket} />
					<Ball
						ballStopped={ballStopped}
						playerPaddle={playerPaddle}
						ownerPaddle={ownerPaddle}
						points={points}
						setPoints={setPoints}
						socket={socket}
					/>
					<RightPaddle paddle={ownerPaddle} socket={socket} />
				</group>
			</Canvas>
	);
}
