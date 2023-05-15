import { Canvas } from "@react-three/fiber";
import LeftPaddle from "./PlayerPaddleOwnerView";
import RightPaddle from "./OwnerPaddleOwnerView";
import { useRef } from "react";
import Background from "../Game/Background";
import { useGameSocket } from "../../context/GameSocketProvider";
import BallServer from "../Game/BallServer";
import { BALL_X_SPEED_MULTIPLIER } from "../GameUtils/Constant";

interface OwnerGameRenderProps {
	room: string;
	accelerator: boolean;
}

export default function OwnerGameRender({
	room,
	accelerator,
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
				<BallServer
					playerPaddle={playerPaddle}
					ownerPaddle={ownerPaddle}
					socket={gameSocket}
					room={room}
					ballMultiplier={accelerator ? BALL_X_SPEED_MULTIPLIER : 1}
				/>
				<RightPaddle paddle={ownerPaddle} socket={gameSocket} room={room} />
			</group>
		</Canvas>
	);
}
