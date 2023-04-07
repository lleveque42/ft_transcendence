import { CEILING, FLOOR, LEFT_PADDLE, MAP_DEPTH, MAP_LENGTH, MAP_WIDTH, RIGHT_PADDLE, WALL_WIDTH } from "../Constant";

export default function Background() {
	return (
		<group>
			{/* NET */}
			<mesh position={[0, 0, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[WALL_WIDTH, MAP_WIDTH]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			{/* BACKGROUND FLOOR */}
			<mesh position={[0, 0, -MAP_DEPTH]}>
				<planeGeometry args={[MAP_LENGTH, MAP_WIDTH]} />
				<meshStandardMaterial color="#2d3436" />
			</mesh>
			{/* FLOOR */}
			<mesh position={[0, FLOOR - WALL_WIDTH, 0]}>
				<boxGeometry args={[MAP_LENGTH, WALL_WIDTH, MAP_DEPTH]} />
				<meshStandardMaterial color="#2d3436" />
			</mesh>
			{/* CEILING */}
			<mesh position={[0, CEILING + WALL_WIDTH, 0]}>
				<boxGeometry args={[MAP_LENGTH, WALL_WIDTH, MAP_DEPTH]} />
				<meshStandardMaterial color="#2d3436" />
			</mesh>
			{/* RIGHT WALL */}
			<mesh position={[MAP_LENGTH / 2, 0, 0]}>
				<boxGeometry args={[WALL_WIDTH, MAP_WIDTH + WALL_WIDTH, MAP_DEPTH]} />
				<meshStandardMaterial color="#2d3436" />
			</mesh>
			{/* LEFT WALL */}
			<mesh position={[-MAP_LENGTH / 2, 0, 0]}>
				<boxGeometry args={[WALL_WIDTH, MAP_WIDTH + WALL_WIDTH, MAP_DEPTH]} />
				<meshStandardMaterial color="#2d3436" />
			</mesh>
		</group>
	);
}
