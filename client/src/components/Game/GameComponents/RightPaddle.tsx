import React, { useEffect, useRef, useState } from "react";
import { useFrame, ThreeElements } from "@react-three/fiber";
import { useGameContext } from "../../../Context/Game/GameContext";
import {
	CEILING,
	FLOOR,
	PADDLE_HALF_SIZE,
	PADDLE_HEIGHT,
	PADDLE_SPEED,
} from "../Constant";
import { ceilToDecimal, floorToDecimal } from "./Utils";

export default function RightPaddle(props: ThreeElements["mesh"]) {
	const paddle = useRef<THREE.Mesh>(null!);
	const { setRightPaddlePosY, mustReset } = useGameContext();
	const [move, setMove] = useState({ up: false, down: false });

	useFrame((state, delta) => {
		if (mustReset) paddle.current.position.y = 0;
		if (move.up) {
			if (
				ceilToDecimal(paddle.current.position.y + PADDLE_HALF_SIZE) < CEILING
			) {
				setRightPaddlePosY(paddle.current.position.y + delta * PADDLE_SPEED);
				paddle.current.position.y += delta * PADDLE_SPEED;
			}
		} else if (move.down) {
			if (
				floorToDecimal(paddle.current.position.y - PADDLE_HALF_SIZE) > FLOOR
			) {
				setRightPaddlePosY(paddle.current.position.y - delta * PADDLE_SPEED);
				paddle.current.position.y -= delta * PADDLE_SPEED;
			}
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
		<mesh {...props} ref={paddle}>
			<boxGeometry args={[0.1, PADDLE_HEIGHT, 0.1]} />
			<meshStandardMaterial color="#74b9ff" />
		</mesh>
	);
}
