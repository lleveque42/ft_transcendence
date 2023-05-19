import { MAP_DEPTH } from "../../../GameUtils/Constant";

export default function SpaceMap() {
	return (
		<group>
			{/* BACKGROUND */}
			<mesh position={[0, 0, -MAP_DEPTH - 4]}>
				<planeGeometry args={[20, 20]} />
				<meshStandardMaterial color="#000000" />
			</mesh>

			{/* SATURN */}
			<mesh position={[3.5, 3.5, -1.5]}>
				<sphereGeometry args={[0.4]} />
				<meshStandardMaterial color="#e3c08a" />
			</mesh>
			<mesh position={[3.5, 3.5, -1.5]}>
				<ringGeometry args={[0.6, 0.75]} />
				<meshStandardMaterial color="#aaa69d" />
			</mesh>
			<mesh position={[3.5, 3.5, -1.5]}>
				<ringGeometry args={[0.8, 0.85]} />
				<meshStandardMaterial color="#4F4537" />
			</mesh>
			<mesh position={[3.5, 3.5, -1.5]}>
				<ringGeometry args={[0.85, 0.9]} />
				<meshStandardMaterial color="#B6A999" />
			</mesh>

			{/* SUN */}
			<mesh position={[-2.5, 4, -1.5]}>
				<pointLight position={[-2.5, 4, -1.5]} />
				<sphereGeometry args={[0.15]} />
				<meshStandardMaterial color="#f39c12" />
			</mesh>

			{/* PLANET */}
			<mesh position={[0.5, 4.75, -2]}>
				<sphereGeometry args={[0.075]} />
				<meshStandardMaterial color="#3596B5" />
			</mesh>

			{/* STARSHIPS */}
			<mesh position={[-1.3, 0, 0.9]} rotation={[Math.PI / 4, -Math.PI / 8, 0]}>
				<torusGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#00D2FC" />
			</mesh>
			<mesh
				position={[-1.35, -0.1, 0.95]}
				rotation={[Math.PI / 4, -Math.PI / 8, 0]}
			>
				<torusGeometry args={[0.1, 0.025]} />
				<meshStandardMaterial color="#003B5F" />
			</mesh>
			<mesh
				position={[-1.35, -0.05, 0.925]}
				rotation={[-Math.PI / 8, 0, -Math.PI / 8]}
			>
				<cylinderGeometry args={[0.05, 0.05, 0.4]} />
				<meshStandardMaterial color="#00141B" />
			</mesh>

			{/* STARS */}
			<mesh position={[1, 2, 0]}>
				<sphereGeometry args={[0.015]} />
				<meshStandardMaterial color="#F9F871" />
			</mesh>
			<mesh position={[1.54, -1.5, -1]}>
				<sphereGeometry args={[0.015]} />
				<meshStandardMaterial color="#F9F871" />
			</mesh>
			<mesh position={[-0.59, 2.54, 0]}>
				<sphereGeometry args={[0.015]} />
				<meshStandardMaterial color="#F9F871" />
			</mesh>
			<mesh position={[-2, 1.46, 0]}>
				<sphereGeometry args={[0.015]} />
				<meshStandardMaterial color="#F9F871" />
			</mesh>
			<mesh position={[-2.6, 2.7, 0]}>
				<sphereGeometry args={[0.015]} />
				<meshStandardMaterial color="#F9F871" />
			</mesh>
			<mesh position={[2, 0.54, 0]}>
				<sphereGeometry args={[0.015]} />
				<meshStandardMaterial color="#F9F871" />
			</mesh>
			<mesh position={[-1.89, -1.69, -1]}>
				<sphereGeometry args={[0.015]} />
				<meshStandardMaterial color="#F9F871" />
			</mesh>
			<mesh position={[-0.59, -1.54, -1]}>
				<sphereGeometry args={[0.015]} />
				<meshStandardMaterial color="#F9F871" />
			</mesh>
			<mesh position={[2.8, -1.79, -1.5]}>
				<sphereGeometry args={[0.015]} />
				<meshStandardMaterial color="#F9F871" />
			</mesh>
			<mesh position={[2.6, 2.7, 0]}>
				<sphereGeometry args={[0.015]} />
				<meshStandardMaterial color="#F9F871" />
			</mesh>
			<mesh position={[3, -0.24, -1]}>
				<sphereGeometry args={[0.015]} />
				<meshStandardMaterial color="#F9F871" />
			</mesh>
			<mesh position={[-2.8, 0.79, -1.5]}>
				<sphereGeometry args={[0.015]} />
				<meshStandardMaterial color="#F9F871" />
			</mesh>
			<mesh position={[-1.9, -0.7, 0]}>
				<sphereGeometry args={[0.015]} />
				<meshStandardMaterial color="#F9F871" />
			</mesh>
			<mesh position={[-0.25, 1.5, 0]}>
				<sphereGeometry args={[0.015]} />
				<meshStandardMaterial color="#F9F871" />
			</mesh>
		</group>
	);
}
