import React, { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
	BALL_RADIUS,
	CEILING,
	FLOOR,
	MAP_DEPTH,
	PADDLE_HALF_SIZE,
	PADDLE_HEIGHT,
	PADDLE_SPEED,
	PADDLE_WIDTH,
	PADDLE_X,
} from "../GameUtils/Constant";
import { ceilToDecimal, floorToDecimal } from "../GameUtils/Utils";
import { Socket } from "socket.io-client";

interface OwnerPaddleProps {
	paddle: React.MutableRefObject<
		THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
	>;
	socket: Socket | null;
	room: string;
}

export default function OwnerPaddle({
	paddle,
	socket,
	room,
}: OwnerPaddleProps) {
	const [move, setMove] = useState({ up: false, down: false });

	// useEffect(() => {
	// 	socket!.on("ownerPaddlePosUpdate", (y: number) => {
	// 		paddle.current.position.y = y;
	// 	});
	// 	return () => {
	// 		socket!.off("ownerPaddlePosUpdate");
	// 	};
	// });

	useFrame((state, delta) => {
		if (
			move.up &&
			ceilToDecimal(paddle.current.position.y + PADDLE_HALF_SIZE) < CEILING
		) {
			paddle.current.position.y += delta * PADDLE_SPEED;
			socket!.emit("updateOwnerPaddlePos", {
				y: paddle.current.position.y,
				room,
			});
		} else if (
			move.down &&
			floorToDecimal(paddle.current.position.y - PADDLE_HALF_SIZE) > FLOOR
		) {
			paddle.current.position.y -= delta * PADDLE_SPEED;
			socket!.emit("updateOwnerPaddlePos", {
				y: paddle.current.position.y,
				room,
			});
		}
	});

	function handleKeyDown(e: KeyboardEvent): void {
		switch (e.key) {
			case "ArrowUp":
				setMove({ up: true, down: false });
				break;
			case "ArrowDown":
				setMove({ up: false, down: true });
				break;
		}
	}

	function handleKeyUp(e: KeyboardEvent): void {
		switch (e.key) {
			case "ArrowUp":
				setMove({ up: false, down: false });
				break;
			case "ArrowDown":
				setMove({ up: false, down: false });
				break;
		}
	}

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);
	}, []);

	return (
		<mesh position={[PADDLE_X + BALL_RADIUS, 0, 0]} ref={paddle}>
			<boxGeometry args={[PADDLE_WIDTH, PADDLE_HEIGHT, MAP_DEPTH]} />
			<meshStandardMaterial color="#74b9ff" />
		</mesh>
	);
}
