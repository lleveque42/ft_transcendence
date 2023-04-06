import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
	RIGHT_PADDLE,
	LEFT_PADDLE,
	CEILING,
	FLOOR,
	PADDLE_HALF_SIZE,
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

interface BallProps {
	leftPaddleRef: React.MutableRefObject<
		THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
	>;
	rightPaddleRef: React.MutableRefObject<
		THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
	>;
	points: { left: number; right: number };
	setPoints: React.Dispatch<
		React.SetStateAction<{ left: number; right: number }>
	>;
}

export default function Ball({
	leftPaddleRef,
	rightPaddleRef,
	points,
	setPoints,
}: BallProps) {
	const [dirVector, setDirVector] = useState(randomBallDir());
	const [xSpeedMultiplier, setXSpeedMultiplier] = useState(1);
	const [resetted, setResetted] = useState(true);
	const ball = useRef<THREE.Mesh>(null!);

	function newBall(): void {
		ball.current.position.x = 0;
		ball.current.position.y = 0;
		setDirVector(randomBallDir());
		setXSpeedMultiplier(1)
	}

	function resetPaddles(): void {
		rightPaddleRef.current.position.y = 0;
		leftPaddleRef.current.position.y = 0;
	}

	function resetPoint(): void {
		newBall();
		resetPaddles();
		setResetted(true);
	}

	function rebound(collision: Collision): { x: number; y: number } {
		switch (collision) {
			case Collision.RIGHT_PADDLE_HIT:
				if (xSpeedMultiplier === 1) setXSpeedMultiplier(2); // speed up ball after first hit
				return {
					x: dirVector.x * -1,
					y:
						((ball.current.position.y - rightPaddleRef.current.position.y) /
							PADDLE_HALF_SIZE) *
						dirVector.x,
				};
			case Collision.LEFT_PADDLE_HIT:
				if (xSpeedMultiplier === 1) setXSpeedMultiplier(2); // speed up ball after first hit
				return {
					x: dirVector.x * -1,
					y:
						((ball.current.position.y - leftPaddleRef.current.position.y) /
							PADDLE_HALF_SIZE) *
						dirVector.x *
						-1,
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
		if (Math.floor(ball.current.position.x) === RIGHT_PADDLE) {
			return onPaddle(rightPaddleRef.current.position.y, Paddle.RIGHT)
				? Collision.RIGHT_PADDLE_HIT
				: Collision.RIGHT_PADDLE_MISSED;
		} else if (Math.ceil(ball.current.position.x) === LEFT_PADDLE) {
			return onPaddle(leftPaddleRef.current.position.y, Paddle.LEFT)
				? Collision.LEFT_PADDLE_HIT
				: Collision.LEFT_PADDLE_MISSED;
		}
		return Collision.NO_HIT;
	}

	function checkWallCollision(): Collision {
		if (inRange(ceilToDecimal(ball.current.position.y), CEILING, CEILING + 0.2))
			return Collision.CEILING_HIT;
		if (inRange(floorToDecimal(ball.current.position.y), FLOOR - 0.2, FLOOR))
			return Collision.FLOOR_HIT;
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
				if (dirVector.x > 0) setDirVector(rebound(collision));
				break;
			case Collision.LEFT_PADDLE_HIT:
				if (dirVector.x < 0) setDirVector(rebound(collision));
				break;
			case Collision.FLOOR_HIT:
				if (dirVector.y < 0) setDirVector(rebound(collision));
				break;
			case Collision.CEILING_HIT:
				if (dirVector.y > 0) setDirVector(rebound(collision));
				break;
			case Collision.RIGHT_PADDLE_MISSED:
				if (resetted) {
					setPoints({ left: points.left + 1, right: points.right });
					setResetted(false);
				}
				break;
			case Collision.LEFT_PADDLE_MISSED:
				if (resetted) {
					setPoints({ left: points.left, right: points.right + 1 });
					setResetted(false);
				}
				break;
			case Collision.OUT_OF_BOUND:
				resetPoint();
				break;
		}
	});

	return (
		<mesh position={[0, 0, 0]} ref={ball}>
			<sphereGeometry args={[BALL_RADIUS]} />

			{/* <boxGeometry args={[0.1, 0.1, 0.1]} /> */}
			<meshStandardMaterial color="#74b9ff" />
		</mesh>
	);
}
