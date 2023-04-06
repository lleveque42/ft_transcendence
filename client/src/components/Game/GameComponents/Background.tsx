import { CEILING, FLOOR, LEFT_PADDLE, RIGHT_PADDLE } from "../Constant";

export default function Background() {
	return (
		<group>
			<mesh position={[0, 0, -0.00009]}>
				<planeGeometry args={[0.1, 7.4]} />
				<meshStandardMaterial color="#dfe6e9" />
			</mesh>
			<mesh position={[0, 0, -0.1]}>
				<planeGeometry args={[10.4, 7.6]} />
				<meshStandardMaterial color="#2d3436" />
			</mesh>
			<mesh position={[0, FLOOR, 0]}>
				<boxGeometry args={[10.4, 0.1,0.1]} />
				<meshStandardMaterial color="#2d3436" />
			</mesh>
			<mesh position={[0, CEILING, 0]}>
				<boxGeometry args={[10.4, 0.1,0.1]} />
				<meshStandardMaterial color="#2d3436" />
			</mesh>
			<mesh position={[RIGHT_PADDLE + 0.2, 0, 0]}>
				<boxGeometry args={[0.1, 7.6,0.1]} />
				<meshStandardMaterial color="#2d3436" />
			</mesh>
			<mesh position={[LEFT_PADDLE - 0.2, 0, 0]}>
				<boxGeometry args={[0.1, 7.6,0.1]} />
				<meshStandardMaterial color="#2d3436" />
			</mesh>
		</group>
	);
}
