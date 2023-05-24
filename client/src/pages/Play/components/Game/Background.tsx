import { MapStatus } from "../../enums/MapStatus";
import {
	BACKGROUND_CITY_COLOR,
	BACKGROUND_DEFAULT_COLOR,
	BACKGROUND_SPACE_COLOR,
	CEILING,
	FLOOR,
	MAP_DEPTH,
	MAP_LENGTH,
	MAP_WIDTH,
	NET_DEFAULT_COLOR,
	NET_SPACE_COLOR,
	WALL_CITY_COLOR,
	WALL_DEFAULT_COLOR,
	WALL_SPACE_COLOR,
	WALL_WIDTH,
} from "../GameUtils/Constant";
import CityMap from "./Maps/City/City.map";
import DefaultMap from "./Maps/Default/Default.map";
import SpaceMap from "./Maps/Space/Space.map";

type BackGroundProps = {
	map: MapStatus;
};

export default function Background({ map }: BackGroundProps) {
	let backgroundColor: string;
	let wallColor: string;
	let netColor: string;

	switch (map) {
		case MapStatus.city:
			backgroundColor = BACKGROUND_CITY_COLOR;
			wallColor = WALL_CITY_COLOR;
			netColor = NET_DEFAULT_COLOR;
			break;
		case MapStatus.space:
			backgroundColor = BACKGROUND_SPACE_COLOR;
			wallColor = WALL_SPACE_COLOR;
			netColor = NET_SPACE_COLOR;
			break;
		default:
			backgroundColor = BACKGROUND_DEFAULT_COLOR;
			wallColor = WALL_DEFAULT_COLOR;
			netColor = NET_DEFAULT_COLOR;
			break;
	}

	return (
		<>
			<group>
				{/* NET */}
				<mesh position={[0, 0, -MAP_DEPTH + 0.0001]}>
					<planeGeometry args={[WALL_WIDTH, MAP_WIDTH]} />
					<meshStandardMaterial color={netColor} />
				</mesh>
				{/* BACKGROUND FLOOR */}
				<mesh position={[0, 0, -MAP_DEPTH]}>
					<planeGeometry args={[MAP_LENGTH, MAP_WIDTH]} />
					<meshStandardMaterial color={backgroundColor} />
				</mesh>
				{/* FLOOR */}
				<mesh position={[0, FLOOR - WALL_WIDTH, 0]}>
					<boxGeometry args={[MAP_LENGTH, WALL_WIDTH, MAP_DEPTH]} />
					<meshStandardMaterial color={wallColor} />
				</mesh>
				{/* CEILING */}
				<mesh position={[0, CEILING + WALL_WIDTH, 0]}>
					<boxGeometry args={[MAP_LENGTH, WALL_WIDTH, MAP_DEPTH]} />
					<meshStandardMaterial color={wallColor} />
				</mesh>
				{/* RIGHT WALL */}
				<mesh position={[MAP_LENGTH / 2, 0, 0]}>
					<boxGeometry args={[WALL_WIDTH, MAP_WIDTH + WALL_WIDTH, MAP_DEPTH]} />
					<meshStandardMaterial color={wallColor} />
				</mesh>
				{/* LEFT WALL */}
				<mesh position={[-MAP_LENGTH / 2, 0, 0]}>
					<boxGeometry args={[WALL_WIDTH, MAP_WIDTH + WALL_WIDTH, MAP_DEPTH]} />
					<meshStandardMaterial color={wallColor} />
				</mesh>
			</group>
			{map === MapStatus.default && <DefaultMap />}
			{map === MapStatus.city && <CityMap />}
			{map === MapStatus.space && <SpaceMap />}
		</>
	);
}
