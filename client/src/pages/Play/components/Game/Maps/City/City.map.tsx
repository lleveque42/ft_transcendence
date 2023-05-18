import { MAP_DEPTH, MAP_LENGTH, MAP_WIDTH } from "../../../GameUtils/Constant";

export default function CityMap() {
	return (
		<group>
			{/* RIGHT SIDE BUILDINGS */}
			<mesh position={[2.55, 2, 0]}>
				<boxGeometry args={[0.4, 0.4, 1]} />
				<meshStandardMaterial color="#3d3d3d" />
			</mesh>
			<mesh position={[2.55, 1.5, -0.1]}>
				<boxGeometry args={[0.4, 0.3, 0.8]} />
				<meshStandardMaterial color="#DEB887" />
			</mesh>
			<mesh position={[2.55, 1, 0.15]}>
				<boxGeometry args={[0.2, 0.4, 1.3]} />
				<meshStandardMaterial color="#696969" />
			</mesh>
			<mesh position={[2.55, 0.5, -0.15]}>
				<boxGeometry args={[0.4, 0.3, 0.7]} />
				<meshStandardMaterial color="#f4ede4" />
			</mesh>
			<mesh position={[2.55, 0.1, -0.3]}>
				<boxGeometry args={[0.4, 0.3, 0.4]} />
				<meshStandardMaterial color="#96281b" />
			</mesh>
			<mesh position={[2.55, -0.4, -0.15]}>
				<boxGeometry args={[0.4, 0.5, 0.7]} />
				<meshStandardMaterial color="#aaa69d" />
			</mesh>
			<mesh position={[2.5, -1, 0.15]}>
				<boxGeometry args={[0.2, 0.4, 1.3]} />
				<meshStandardMaterial color="#95A5A6" />
			</mesh>

			{/* TOP SIDE BUILDINGS */}
			<mesh position={[-1.2, 2.5, -0.15]}>
				<boxGeometry args={[0.2, 0.5, 0.7]} />
				<meshStandardMaterial color="#696969" />
			</mesh>
			<mesh position={[-0.9, 2.5, 0.25]}>
				<boxGeometry args={[0.1, 0.4, 1.5]} />
				<meshStandardMaterial color="#2C3E50" />
			</mesh>
			<mesh position={[-0.5, 2.5, 0.1]}>
				<boxGeometry args={[0.4, 0.3, 1.2]} />
				<meshStandardMaterial color="#f4ede4" />
			</mesh>
			<mesh position={[0, 2.5, 0]}>
				<boxGeometry args={[0.4, 0.4, 1]} />
				<meshStandardMaterial color="#3d3d3d" />
			</mesh>
			<mesh position={[0.6, 2.5, -0.15]}>
				<boxGeometry args={[0.5, 0.5, 0.7]} />
				<meshStandardMaterial color="#aaa69d" />
			</mesh>
			<mesh position={[1.1, 2.5, 0.25]}>
				<boxGeometry args={[0.2, 0.4, 1.5]} />
				<meshStandardMaterial color="#2C3E50" />
			</mesh>
			<mesh position={[1.6, 2.5, -0.25]}>
				<boxGeometry args={[0.4, 0.5, 0.5]} />
				<meshStandardMaterial color="#DEB887" />
			</mesh>
			<mesh position={[2.5, 2.5, -0.2]}>
				<boxGeometry args={[0.4, 0.5, 0.6]} />
				<meshStandardMaterial color="#BCAAA4" />
			</mesh>

			{/* LEFT SIDE BUILDINGS */}
			<mesh position={[-2.15, 0.9, 0.5]}>
				<boxGeometry args={[0.4, 0.4, 1]} />
				<meshStandardMaterial color="#696969" />
			</mesh>
			<mesh position={[-2, 0.45, 0.5]}>
				<boxGeometry args={[0.2, 0.1, 0.9]} />
				<meshStandardMaterial color="#DEB887" />
			</mesh>
			<mesh position={[-1.95, 0.15, 0.5]}>
				<boxGeometry args={[0.2, 0.2, 0.7]} />
				<meshStandardMaterial color="#BCAAA4" />
			</mesh>
			<mesh position={[-2.15, -0.75, 0.5]}>
				<boxGeometry args={[0.4, 0.4, 1]} />
				<meshStandardMaterial color="#3d3d3d" />
			</mesh>

			{/* SIDEWALKS */}
			<mesh position={[0, 0, -MAP_DEPTH - 1]}>
				<planeGeometry args={[12, 10]} />
				<meshStandardMaterial color="#2E7D32" />
			</mesh>
			<mesh position={[0, 0.5, -MAP_DEPTH - 0.9]}>
				<planeGeometry args={[5.55, 4.75]} />
				<meshStandardMaterial color="#4D4D4D" />
			</mesh>
			<mesh position={[-2.35, 1.5, -MAP_DEPTH - 0.9]}>
				<planeGeometry args={[0.85, 7.5]} />
				<meshStandardMaterial color="#4D4D4D" />
			</mesh>
			<mesh position={[-2.5, 2.45, -MAP_DEPTH - 0.9]}>
				<planeGeometry args={[4, 0.85]} />
				<meshStandardMaterial color="#4D4D4D" />
			</mesh>
			<mesh position={[0.3, 2.45, -MAP_DEPTH - 0.9]}>
				<planeGeometry args={[4, 2.5]} />
				<meshStandardMaterial color="#4D4D4D" />
			</mesh>
			<mesh position={[3, 1, -MAP_DEPTH - 0.9]}>
				<planeGeometry args={[1, 5]} />
				<meshStandardMaterial color="#4D4D4D" />
			</mesh>
			<mesh position={[-3, 1.25, -MAP_DEPTH - 0.9]}>
				<planeGeometry args={[0.8, 1.7]} />
				<meshStandardMaterial color="#4D4D4D" />
			</mesh>
			<mesh position={[-3, -0.65, -MAP_DEPTH - 0.9]}>
				<planeGeometry args={[0.8, 0.8]} />
				<meshStandardMaterial color="#4D4D4D" />
			</mesh>

			{/* SAND */}
			<mesh position={[-4, 4, -MAP_DEPTH - 0.8]}>
				<circleGeometry args={[0.2, 5]} />
				<meshStandardMaterial color="#F0DEB4" />
			</mesh>
			<mesh position={[-3.6, 3.8, -MAP_DEPTH - 0.8]}>
				<circleGeometry args={[0.1, 5]} />
				<meshStandardMaterial color="#F0DEB4" />
			</mesh>
			<mesh position={[-3, 4.3, -MAP_DEPTH - 0.8]}>
				<circleGeometry args={[0.15, 7]} />
				<meshStandardMaterial color="#F0DEB4" />
			</mesh>
			<mesh position={[2.3, 4.6, -MAP_DEPTH - 0.8]}>
				<circleGeometry args={[0.2, 5]} />
				<meshStandardMaterial color="#F0DEB4" />
			</mesh>
			<mesh position={[3.6, 3.8, -MAP_DEPTH - 0.8]}>
				<circleGeometry args={[0.1, 5]} />
				<meshStandardMaterial color="#F0DEB4" />
			</mesh>

			{/* LAKES */}
			<mesh position={[-4.7, 4.5, -MAP_DEPTH - 0.8]}>
				<circleGeometry args={[0.4, 8]} />
				<meshStandardMaterial color="#043b5c" />
			</mesh>
			<mesh position={[-3.2, 3.2, -MAP_DEPTH - 0.8]}>
				<circleGeometry args={[0.3, 8]} />
				<meshStandardMaterial color="#043b5c" />
			</mesh>
			<mesh position={[4.3, 4.5, -MAP_DEPTH - 0.8]}>
				<circleGeometry args={[0.4, 8]} />
				<meshStandardMaterial color="#043b5c" />
			</mesh>
			<mesh position={[3, 4, -MAP_DEPTH - 0.8]}>
				<circleGeometry args={[0.3, 8]} />
				<meshStandardMaterial color="#043b5c" />
			</mesh>
			<mesh position={[0.5, 4.5, -MAP_DEPTH - 0.8]}>
				<circleGeometry args={[0.4, 8]} />
				<meshStandardMaterial color="#043b5c" />
			</mesh>
			<mesh position={[-3, 0.05, -MAP_DEPTH - 0.8]}>
				<circleGeometry args={[0.2, 8]} />
				<meshStandardMaterial color="#043b5c" />
			</mesh>

			{/* ROAD */}
			<mesh position={[-1, 1.5, -MAP_DEPTH]}>
				<planeGeometry args={[MAP_LENGTH + 3, 0.4]} />
				<meshStandardMaterial color="#2d3436" />
			</mesh>
			<mesh position={[1.75, 0.125, -MAP_DEPTH]}>
				<planeGeometry args={[0.4, MAP_WIDTH + 1]} />
				<meshStandardMaterial color="#2d3436" />
			</mesh>
			<mesh position={[0, -1.35, -MAP_DEPTH]}>
				<planeGeometry args={[MAP_LENGTH + 1.1, 0.4]} />
				<meshStandardMaterial color="#2d3436" />
			</mesh>
			<mesh position={[-1.75, 0.125, -MAP_DEPTH]}>
				<planeGeometry args={[0.4, MAP_WIDTH + 6]} />
				<meshStandardMaterial color="#2d3436" />
			</mesh>

			{/* ROAD LINES */}
			<mesh position={[-2.325, 1.5, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.5, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[0, 1.5, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[MAP_LENGTH, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[1.65, 1.5, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.2, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.75, 0.075, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, MAP_WIDTH]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[1.65, -1.35, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.2, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[0, -1.35, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[MAP_LENGTH, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[1.75, 0.075, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, MAP_LENGTH + 0.075]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.75, 2.9, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, MAP_WIDTH]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>

			{/* CROSSING BOTTOM LEFT*/}
			<mesh position={[-1.6, -1.075, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.65, -1.075, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.7, -1.075, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.75, -1.075, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.8, -1.075, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.85, -1.075, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.9, -1.075, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>

			{/* CROSSING BOTTOM LEFT*/}
			<mesh position={[-1.6, -1.62, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.65, -1.62, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.7, -1.62, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.75, -1.62, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.8, -1.62, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.85, -1.62, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.9, -1.62, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>

			{/* CROSSING BOTTOM LEFT*/}
			<mesh position={[-1.475, -1.2, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.475, -1.25, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.475, -1.3, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.475, -1.35, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.475, -1.4, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.475, -1.45, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.475, -1.5, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>

			{/* CROSSING TOP LEFT*/}
			<mesh position={[-1.6, 1.225, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.65, 1.225, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.7, 1.225, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.75, 1.225, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.8, 1.225, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.85, 1.225, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.9, 1.225, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>

			{/* CROSSING TOP LEFT*/}
			<mesh position={[-1.6, 1.75, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.65, 1.75, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.7, 1.75, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.75, 1.75, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.8, 1.75, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.85, 1.75, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.9, 1.75, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.025, 0.1]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>

			{/* CROSSING TOP LEFT*/}
			<mesh position={[-2, 1.35, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-2, 1.4, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-2, 1.45, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-2, 1.5, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-2, 1.55, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-2, 1.6, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-2, 1.65, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>

			{/* CROSSING TOP LEFT*/}
			<mesh position={[-1.475, 1.35, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.475, 1.4, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.475, 1.45, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.475, 1.5, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.475, 1.55, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.475, 1.6, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[-1.475, 1.65, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>

			{/* CROSSING TOP RIGHT*/}
			<mesh position={[1.475, 1.35, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[1.475, 1.4, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[1.475, 1.45, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[1.475, 1.5, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[1.475, 1.55, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[1.475, 1.6, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[1.475, 1.65, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>

			{/* CROSSING BOTTOM RIGHT*/}
			<mesh position={[1.475, -1.2, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[1.475, -1.25, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[1.475, -1.3, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[1.475, -1.35, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[1.475, -1.4, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[1.475, -1.45, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[1.475, -1.5, -MAP_DEPTH + 0.0001]}>
				<planeGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
		</group>
	);
}
