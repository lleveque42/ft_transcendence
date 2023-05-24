import { Socket } from "socket.io-client";
import { GameUserStatus } from "../../../enums/UserStatus";
import { useState } from "react";
import { Toggle } from "../../../../../components/Toggle/Toggle";
import { MapStatus } from "../../../enums/MapStatus";
import styles from "./Options.module.scss";
import defaultMap from "../../../../../assets/images/maps/default.png";
import cityMap from "../../../../../assets/images/maps/city.png";
import spaceMap from "../../../../../assets/images/maps/space.png";

interface OptionsProps {
	gameSocket: Socket | null;
	setGameUserStatus: React.Dispatch<React.SetStateAction<GameUserStatus>>;
	setAcceleratorOption: React.Dispatch<React.SetStateAction<boolean>>;
	setMapOption: React.Dispatch<React.SetStateAction<MapStatus>>;
}

export default function Options({
	gameSocket,
	setGameUserStatus,
	setAcceleratorOption,
	setMapOption,
}: OptionsProps) {
	const [mapToggle, setMapToggle] = useState<MapStatus>(MapStatus.default);
	const [acceleratorToggle, setAcceleratorToggle] = useState<boolean>(false);

	return (
		<>
			<div className="title mb-20">Options</div>
			<div className="mb-10 d-flex align-items justify-content">
				<div className="underTitle">
					Increasing speed (x0.01 on each strike) :
				</div>
				<Toggle
					toggled={false}
					onClick={() => {
						setAcceleratorToggle(!acceleratorToggle);
						setAcceleratorOption(!acceleratorToggle);
					}}
				/>
			</div>
			<div className={`${styles.mapToggler} mb-10`}>
				<div className="underTitle mb-10">Chose map:</div>
				<img
					src={defaultMap}
					alt="default"
					className={`${
						mapToggle === MapStatus.default
							? styles.imgFocused
							: styles.imgUnfocused
					}`}
					onClick={() => {
						setMapToggle(MapStatus.default);
						setMapOption(MapStatus.default);
					}}
				/>
				<img
					src={cityMap}
					alt="city"
					className={`${
						mapToggle === MapStatus.city
							? styles.imgFocused
							: styles.imgUnfocused
					}`}
					onClick={() => {
						setMapToggle(MapStatus.city);
						setMapOption(MapStatus.city);
					}}
				/>
				{/* <img
					src={map}
					alt="postApo"
					className={`${
						mapToggle === MapStatus.postApo
							? styles.imgFocused
							: styles.imgUnfocused
					}`}
					onClick={() => {
						setMapToggle(MapStatus.postApo);
						setMapOption(MapStatus.postApo);
					}}
				/> */}
				<img
					src={spaceMap}
					alt="space"
					className={`${
						mapToggle === MapStatus.space
							? styles.imgFocused
							: styles.imgUnfocused
					}`}
					onClick={() => {
						setMapToggle(MapStatus.space);
						setMapOption(MapStatus.space);
					}}
				/>
			</div>
			<button
				className="btn-primary mb-10"
				onClick={() => {
					setGameUserStatus(GameUserStatus.readyToStart);
					gameSocket?.emit("playerReady", {
						map: mapToggle,
						accelerator: acceleratorToggle,
					});
				}}
			>
				Ready !
			</button>
		</>
	);
}
