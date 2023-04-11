import { Canvas } from "@react-three/fiber";
import LeftPaddle from "./GameComponents/LeftPaddle";
import RightPaddle from "./GameComponents/RightPaddle";
import Ball from "./GameComponents/Ball";
import { useRef } from "react";
import Background from "./GameComponents/Background";

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
	// const ball = useRef<THREE.Mesh>(null!);

	return (
		<Canvas camera={{ position: [0, 0, 2] }}>
			<ambientLight intensity={0.2} />
			<pointLight position={[0, 0.75, 1]} />
			<group>
				<Background />
				<LeftPaddle paddle={leftPaddleRef} />
				<Ball
					ballStopped={ballStopped}
					leftPaddleRef={leftPaddleRef}
					rightPaddleRef={rightPaddleRef}
					points={points}
					setPoints={setPoints}
				/>
				<RightPaddle paddle={rightPaddleRef} />
			</group>
		</Canvas>
	);
}
