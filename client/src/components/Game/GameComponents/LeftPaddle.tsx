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
} from "../Constant";
import { ceilToDecimal, floorToDecimal } from "./Utils";
import { Socket } from "socket.io-client";

interface LeftPaddleProps {
	paddle: React.MutableRefObject<
		THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
	>;
	socket: React.MutableRefObject<Socket>;
}

export default function LeftPaddle({ paddle, socket }: LeftPaddleProps) {
	const [move, setMove] = useState({ up: false, down: false });

	useFrame((state, delta) => {
		if (
			move.up &&
			ceilToDecimal(paddle.current.position.y + PADDLE_HALF_SIZE) < CEILING
		) {
			paddle.current.position.y += delta * PADDLE_SPEED;
			socket.current.emit("updateLeftPaddlePos", paddle.current.position.y);
		} else if (
			move.down &&
			floorToDecimal(paddle.current.position.y - PADDLE_HALF_SIZE) > FLOOR
		) {
			paddle.current.position.y -= delta * PADDLE_SPEED;
			socket.current.emit("updateLeftPaddlePos", paddle.current.position.y);
		}
	});

	function handleKeyDown(e: KeyboardEvent): any {
		switch (e.key) {
			case "w":
			case "W":
				setMove({ up: true, down: false });
				break;
			case "s":
			case "S":
				setMove({ up: false, down: true });
				break;
		}
	}

	function handleKeyUp(e: KeyboardEvent): any {
		switch (e.key) {
			case "w":
			case "W":
				setMove({ up: false, down: false });
				break;
			case "s":
			case "S":
				setMove({ up: false, down: false });
				break;
		}
	}

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);
	}, []);

	return (
		<mesh position={[-PADDLE_X - BALL_RADIUS, 0, 0]} ref={paddle}>
			<boxGeometry args={[PADDLE_WIDTH, PADDLE_HEIGHT, MAP_DEPTH]} />
			<meshStandardMaterial color="#74b9ff" />
		</mesh>
	);
}
