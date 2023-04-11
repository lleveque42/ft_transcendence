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
	BALL_REBOUND_Y_MULTIPLIER,
	BALL_1ST_REBOUND_X_SPEED_MULTIPLIER,
	BALL_SPAWN_X_SPEED_MULTIPLIER,
} from "../Constant";
import {
	randomBallDir,
	inRange,
	outOfRange,
	ceilToDecimal,
	floorToDecimal,
} from "./Utils";
import { useTimer } from "use-timer";
import { Socket } from "socket.io-client";

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
	ballStopped: boolean;
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
	socket: React.MutableRefObject<Socket>;
}

export default function Ball({
	ballStopped,
	leftPaddleRef,
	rightPaddleRef,
	points,
	setPoints,
	socket,
}: BallProps) {
	const [dirVector, setDirVector] = useState(randomBallDir());
	const [xSpeedMultiplier, setXSpeedMultiplier] = useState(
		BALL_SPAWN_X_SPEED_MULTIPLIER,
	);
	const [resetted, setResetted] = useState(true);
	const ball = useRef<THREE.Mesh>(null!);

	const { start, pause, status } = useTimer();

	function newBall(): void {
		ball.current.position.x = 0;
		ball.current.position.y = 0;
		setDirVector(randomBallDir());
		setXSpeedMultiplier(1);
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
				if (xSpeedMultiplier === BALL_SPAWN_X_SPEED_MULTIPLIER)
					setXSpeedMultiplier(BALL_1ST_REBOUND_X_SPEED_MULTIPLIER);
				return {
					x: -dirVector.x,
					y:
						((ball.current.position.y - rightPaddleRef.current.position.y) /
							PADDLE_HALF_SIZE) *
						dirVector.x *
						BALL_REBOUND_Y_MULTIPLIER,
				};
			case Collision.LEFT_PADDLE_HIT:
				if (xSpeedMultiplier === BALL_SPAWN_X_SPEED_MULTIPLIER)
					setXSpeedMultiplier(BALL_1ST_REBOUND_X_SPEED_MULTIPLIER);
				return {
					x: -dirVector.x,
					y:
						((ball.current.position.y - leftPaddleRef.current.position.y) /
							PADDLE_HALF_SIZE) *
						dirVector.x *
						-BALL_REBOUND_Y_MULTIPLIER,
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
		return inRange(
			ball.current.position.y,
			paddlePosY - PADDLE_HALF_SIZE - BALL_RADIUS,
			paddlePosY + PADDLE_HALF_SIZE + BALL_RADIUS,
		)
			? side === Paddle.LEFT
				? ball.current.position.x > LEFT_PADDLE - BALL_RADIUS - PADDLE_WIDTH
				: ball.current.position.x < RIGHT_PADDLE + BALL_RADIUS + PADDLE_WIDTH
			: false;
	}

	function checkPaddleCollision(delta: number): Collision {
		if (
			inRange(
				floorToDecimal(ball.current.position.x + BALL_RADIUS),
				RIGHT_PADDLE - delta * 1.5,
				RIGHT_PADDLE + PADDLE_WIDTH,
			)
		) {
			return onPaddle(rightPaddleRef.current.position.y, Paddle.RIGHT)
				? Collision.RIGHT_PADDLE_HIT
				: Collision.RIGHT_PADDLE_MISSED;
		} else if (
			inRange(
				ceilToDecimal(ball.current.position.x - BALL_RADIUS),
				LEFT_PADDLE - PADDLE_WIDTH,
				LEFT_PADDLE + delta * 1.5,
			)
		) {
			return onPaddle(leftPaddleRef.current.position.y, Paddle.LEFT)
				? Collision.LEFT_PADDLE_HIT
				: Collision.LEFT_PADDLE_MISSED;
		}
		return Collision.NO_HIT;
	}

	function checkWallCollision(delta: number): Collision {
		return inRange(
			ceilToDecimal(ball.current.position.y),
			CEILING - delta * 1.5,
			CEILING + 1,
		)
			? Collision.CEILING_HIT
			: inRange(
					floorToDecimal(ball.current.position.y),
					FLOOR - 1,
					FLOOR + delta * 1.5,
			  )
			? Collision.FLOOR_HIT
			: Collision.NO_HIT;
	}

	function checkCollision(delta: number): Collision {
		if (outOfRange(ball.current.position.x, -OUT_OF_RANGE, OUT_OF_RANGE))
			return Collision.OUT_OF_BOUND;
		const collision = checkPaddleCollision(delta);
		return collision !== Collision.NO_HIT
			? collision
			: checkWallCollision(delta);
	}

	useFrame((state, delta) => {
		switch (status) {
			case "STOPPED":
			case "PAUSED":
				if (!ballStopped) start();
				break;
			case "RUNNING":
				if (ballStopped) pause();
				setXSpeedMultiplier(xSpeedMultiplier); // modify so ball speed up
				ball.current.position.x += delta * dirVector.x * xSpeedMultiplier;
				ball.current.position.y += delta * dirVector.y;
				socket.current.emit("updateBallPos", {
					x: ball.current.position.x,
					y: ball.current.position.y,
				});
				const collision = checkCollision(delta);
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
