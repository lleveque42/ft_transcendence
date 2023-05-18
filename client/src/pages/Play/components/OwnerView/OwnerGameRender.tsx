import { Canvas } from "@react-three/fiber";
import LeftPaddle from "./PlayerPaddleOwnerView";
import RightPaddle from "./OwnerPaddleOwnerView";
import { useRef } from "react";
import Background from "../Game/Background";
import { useGameSocket } from "../../context/GameSocketProvider";
import BallServer from "../Game/BallServer";
import { BALL_X_SPEED_MULTIPLIER } from "../GameUtils/Constant";
import { MapStatus } from "../../enums/MapStatus";
import { defaultCamera, mapCamera } from "../Game/Maps/cameraSettings";

interface OwnerGameRenderProps {
	room: string;
	accelerator: boolean;
	map: MapStatus;
}

export default function OwnerGameRender({
	room,
	accelerator,
	map,
}: OwnerGameRenderProps) {
	const playerPaddle = useRef<THREE.Mesh>(null!);
	const ownerPaddle = useRef<THREE.Mesh>(null!);
	const { gameSocket } = useGameSocket();
	const cameraPosition = map === MapStatus.default ? defaultCamera : mapCamera;

	return (
		<Canvas camera={{ position: cameraPosition }}>
			<ambientLight intensity={0.2} />
			<pointLight position={[0, 0.5, 1]} />
			<group>
				<Background map={map} />
				<LeftPaddle paddle={playerPaddle} socket={gameSocket} map={map} />
				<BallServer
					playerPaddle={playerPaddle}
					ownerPaddle={ownerPaddle}
					socket={gameSocket}
					room={room}
					ballMultiplier={accelerator ? BALL_X_SPEED_MULTIPLIER : 1}
					map={map}
				/>
				<RightPaddle
					paddle={ownerPaddle}
					socket={gameSocket}
					room={room}
					map={map}
				/>
			</group>
		</Canvas>
	);
}
