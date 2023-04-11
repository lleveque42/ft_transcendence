import { Canvas } from "@react-three/fiber";
import LeftPaddle from "./GameComponents/LeftPaddle";
import RightPaddle from "./GameComponents/RightPaddle";
import Ball from "./GameComponents/Ball";
import { useEffect, useRef } from "react";
import Background from "./GameComponents/Background";
import { Socket, io } from "socket.io-client";

interface GameRenderProps {
	ballStopped: boolean;
	points: { left: number; right: number };
	setPoints: React.Dispatch<
		React.SetStateAction<{ left: number; right: number }>
	>;
}

export default function GameRender({
	ballStopped,
	points,
	setPoints,
}: GameRenderProps) {
	const leftPaddleRef = useRef<THREE.Mesh>(null!);
	const rightPaddleRef = useRef<THREE.Mesh>(null!);
	const socket = useRef<Socket>(null!);
	// const ball = useRef<THREE.Mesh>(null!);

	function connect(): Socket {
		socket.current = io("http://localhost:8001");
		return socket.current;
	}

	useEffect(() => {
		socket.current = connect();
	});

	return (
		<Canvas camera={{ position: [0, 0, 2] }}>
			<ambientLight intensity={0.2} />
			<pointLight position={[0, 0.75, 1]} />
			<group>
				<Background />
				<LeftPaddle paddle={leftPaddleRef} socket={socket} />
				<Ball
					ballStopped={ballStopped}
					leftPaddleRef={leftPaddleRef}
					rightPaddleRef={rightPaddleRef}
					points={points}
					setPoints={setPoints}
					socket={socket}
				/>
				<RightPaddle paddle={rightPaddleRef} socket={socket} />
			</group>
		</Canvas>
	);
}
