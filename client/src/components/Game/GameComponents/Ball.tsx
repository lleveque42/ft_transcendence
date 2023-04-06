import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameContext } from "../../../Context/Game/GameContext";
import {
	RIGHT_PADDLE,
	LEFT_PADDLE,
	CEILING,
	FLOOR,
	PADDLE_HALF_SIZE,
	PADDLE_X,
	BALL_RADIUS,
	OUT_OF_RANGE,
	PADDLE_WIDTH,
} from "../Constant";
import {
	randomBallDir,
	inRange,
	outOfRange,
	ceilToDecimal,
	floorToDecimal,
} from "./Utils";

const enum Collision {
	NO_HIT,
	OUT_OF_BOUND,
	RIGHT_PADDLE_HIT,
	RIGHT_PADDLE_MISSED,
	LEFT_PADDLE_HIT,
	LEFT_PADDLE_MISSED,
	CEILING_HIT,
	FLOOR_HIT,
}

const enum Paddle {
	LEFT,
	RIGHT,
}

export default function Ball() {
	const {
		leftPaddlePosY,
		setLeftPaddlePosY,
		rightPaddlePosY,
		setRightPaddlePosY,
		setMustReset,
	} = useGameContext();
	const [dirVector, setDirVector] = useState(randomBallDir());
	const [xSpeedMultiplier, setXSpeedMultiplier] = useState(1);
	const [justChangedDirFromPaddle, setJustChangedDirFromPaddle] =
		useState(false);
	const [justChangedDirFromWall, setJustChangedDirFromWall] = useState(false);
	const ball = useRef<THREE.Mesh>(null!);

	function newBall(): void {
		ball.current.position.x = 0;
		ball.current.position.y = 0;
		setDirVector(randomBallDir());
	}

	function resetPaddles(): void {
		setLeftPaddlePosY(0);
		setRightPaddlePosY(0);
	}

	function resetPoint(): void {
		newBall();
		resetPaddles();
		setJustChangedDirFromPaddle(false);
		setJustChangedDirFromWall(false);
		setMustReset(true);
		setTimeout(() => setMustReset(false), 20);
	}

	function rebound(collision: Collision) {
		switch (collision) {
			case Collision.RIGHT_PADDLE_HIT:
			case Collision.LEFT_PADDLE_HIT:
				return {
					x: dirVector.x * -1,
					y: dirVector.y,
				};
			case Collision.FLOOR_HIT:
			case Collision.CEILING_HIT:
				return {
					x: dirVector.x,
					y: dirVector.y * -1,
				};
		}
		return {
			x: dirVector.x,
			y: dirVector.y,
		};
	}

	function onPaddle(paddlePosY: number, side: Paddle): Boolean {
		if (
			inRange(
				ball.current.position.y,
				paddlePosY - PADDLE_HALF_SIZE,
				paddlePosY + PADDLE_HALF_SIZE,
			)
		) {
			return side === Paddle.LEFT
				? ball.current.position.x > LEFT_PADDLE - BALL_RADIUS - PADDLE_WIDTH
				: ball.current.position.x < RIGHT_PADDLE + BALL_RADIUS + PADDLE_WIDTH;
		}
		return false;
	}

	function checkPaddleCollision(): Collision {
		if (!justChangedDirFromPaddle) {
			if (Math.floor(ball.current.position.x) === RIGHT_PADDLE) {
				return onPaddle(rightPaddlePosY, Paddle.RIGHT)
					? Collision.RIGHT_PADDLE_HIT
					: Collision.RIGHT_PADDLE_MISSED;
			} else if (Math.ceil(ball.current.position.x) === LEFT_PADDLE) {
				return onPaddle(leftPaddlePosY, Paddle.LEFT)
					? Collision.LEFT_PADDLE_HIT
					: Collision.LEFT_PADDLE_MISSED;
			}
		} else if (
			inRange(
				ball.current.position.x,
				-PADDLE_X + BALL_RADIUS,
				PADDLE_X - BALL_RADIUS,
			)
		)
			setJustChangedDirFromPaddle(false);
		return Collision.NO_HIT;
	}

	function checkWallCollision(): Collision {
		if (!justChangedDirFromWall) {
			if (ceilToDecimal(ball.current.position.y) === CEILING)
				return Collision.CEILING_HIT;
			else if (floorToDecimal(ball.current.position.y) === FLOOR)
				return Collision.FLOOR_HIT;
		} else if (
			inRange(
				ball.current.position.x,
				FLOOR + BALL_RADIUS,
				CEILING - BALL_RADIUS,
			)
		)
			setJustChangedDirFromWall(false);
		return Collision.NO_HIT;
	}

	function checkCollision(): Collision {
		if (outOfRange(ball.current.position.x, -OUT_OF_RANGE, OUT_OF_RANGE))
			return Collision.OUT_OF_BOUND;
		const collision = checkPaddleCollision();
		return collision !== Collision.NO_HIT ? collision : checkWallCollision();
	}

	useFrame((state, delta) => {
		setXSpeedMultiplier(xSpeedMultiplier); // modify so ball speed up
		ball.current.position.x += delta * dirVector.x * xSpeedMultiplier;
		ball.current.position.y += delta * dirVector.y;
		const collision = checkCollision();
		switch (collision) {
			case Collision.NO_HIT:
				break;
			case Collision.RIGHT_PADDLE_HIT:
			case Collision.LEFT_PADDLE_HIT:
				setDirVector(rebound(collision));
				setJustChangedDirFromPaddle(true);
				break;
			case Collision.FLOOR_HIT:
			case Collision.CEILING_HIT:
				setDirVector(rebound(collision));
				setJustChangedDirFromWall(true);
				break;
			case Collision.OUT_OF_BOUND:
				resetPoint();
				break;
			// case Collision.RIGHT_PADDLE_MISSED:
			// case Collision.LEFT_PADDLE_MISSED:
			// 	add point to player who won
			// 	break;
		}
	});

	return (
		<>
			{/* <mesh position={[-PADDLE_X - BALL_RADIUS, leftPaddlePosY, 0]}>
				<boxGeometry args={[0.1, 1, 0.1]} />
				<meshStandardMaterial color="red" />
			</mesh> */}
			<mesh position={[0, 0, 0]} ref={ball}>
				<sphereGeometry args={[0.07]} />
				<meshStandardMaterial color="#74b9ff" />
			</mesh>
			{/* <mesh position={[PADDLE_X + BALL_RADIUS, rightPaddlePosY, 0]}>
				<boxGeometry args={[0.1, 1, 0.1]} />
				<meshStandardMaterial color="red" />
			</mesh> */}
		</>
	);
}
