import { WALL_DEFAULT_COLOR } from "../../../GameUtils/Constant";

export default function DefaultMap() {
	return (
		<mesh position={[0, 0, -1]}>
			<planeGeometry args={[6, 5]} />
			<meshStandardMaterial color={WALL_DEFAULT_COLOR} />
		</mesh>
	);
}
