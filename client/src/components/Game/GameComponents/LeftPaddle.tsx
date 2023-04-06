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

export default function LeftPaddle(props: ThreeElements["mesh"]) {
	const paddle = useRef<THREE.Mesh>(null!);
	const { setLeftPaddlePosY, mustReset } = useGameContext();
	const [move, setMove] = useState({ up: false, down: false });

	useFrame((state, delta) => {
		if (mustReset) paddle.current.position.y = 0;
		if (move.up) {
			if (
				ceilToDecimal(paddle.current.position.y + PADDLE_HALF_SIZE) < CEILING
			) {
				setLeftPaddlePosY(paddle.current.position.y + delta * PADDLE_SPEED);
				paddle.current.position.y += delta * PADDLE_SPEED;
			}
		} else if (move.down) {
			if (
				floorToDecimal(paddle.current.position.y - PADDLE_HALF_SIZE) > FLOOR
			) {
				setLeftPaddlePosY(paddle.current.position.y - delta * PADDLE_SPEED);
				paddle.current.position.y -= delta * PADDLE_SPEED;
			}
		}
	});

	function handleKeyDown(e: KeyboardEvent): any {
		switch (e.key) {
			case "w":
				setMove({ up: true, down: false });
				break;
			case "s":
				setMove({ up: false, down: true });
				break;
		}
	}

	function handleKeyUp(e: KeyboardEvent): any {
		switch (e.key) {
			case "w":
				setMove({ up: false, down: false });
				break;
			case "s":
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
