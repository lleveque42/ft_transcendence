import { Canvas } from "@react-three/fiber";
import LeftPaddle from "./PlayerPaddlePlayerView";
import RightPaddle from "./OwnerPaddlePlayerView";
import Ball from "../Game/Ball";
import { useRef } from "react";
import Background from "../Game/Background";
import { useGameSocket } from "../../context/GameSocketProvider";
import { MapStatus } from "../../enums/MapStatus";
import { defaultCamera, mapCamera } from "../Game/Maps/cameraSettings";

interface PlayerGameRenderProps {
	room: string;
	map: MapStatus;
}

export default function PlayerGameRender({ room, map }: PlayerGameRenderProps) {
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
				<LeftPaddle
					paddle={playerPaddle}
					socket={gameSocket}
					room={room}
					map={map}
				/>
				<Ball socket={gameSocket} map={map} />
				<RightPaddle paddle={ownerPaddle} socket={gameSocket} map={map} />
			</group>
		</Canvas>
	);
}
