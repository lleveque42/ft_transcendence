import { Canvas } from "@react-three/fiber";
import LeftPaddle from "./GameComponents/LeftPaddle";
import RightPaddle from "./GameComponents/RightPaddle";
import Ball from "./GameComponents/Ball";
import { useRef } from "react";

interface GameRenderProps {
	points: { left: number; right: number };
	setPoints: React.Dispatch<
		React.SetStateAction<{ left: number; right: number }>
	>;
}

export default function GameRender({ points, setPoints }: GameRenderProps) {
	const leftPaddleRef = useRef<THREE.Mesh>(null!);
	const rightPaddleRef = useRef<THREE.Mesh>(null!);

	return (
		<Canvas>
			<ambientLight intensity={0.2} />
			<pointLight position={[0, 5, 10]} />
			<group>
				<LeftPaddle paddle={leftPaddleRef} />
				<Ball
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
