import mapDefault from "../../../../assets/images/maps/default.png";
import mapCity from "../../../../assets/images/maps/city.png";
import mapSpace from "../../../../assets/images/maps/space.png";
import { useEffect, useState } from "react";
import styles from "./Maps.module.scss";

interface Photo {
	id: number;
	src: string;
	alt: string;
}

const photos: Photo[] = [
	{
		id: 0,
		src: mapDefault,
		alt: "mapDefault",
	},
	{
		id: 1,
		src: mapCity,
		alt: "mapCity",
	},
	{
		id: 2,
		src: mapSpace,
		alt: "mapSpace",
	},
];

export default function Maps() {
	const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

	useEffect(() => {
		setTimeout(() => {
			switch (currentPhotoIndex) {
				case 0:
					setCurrentPhotoIndex(1);
					break;
				case 1:
					setCurrentPhotoIndex(2);
					break;
				case 2:
					setCurrentPhotoIndex(0);
					break;
			}
		}, 5000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPhotoIndex]);

	return (
		<>
			<h3 className={`underTitle mt-10 mb-10 ${styles.maps}`}>
				New maps available !
			</h3>
			<img
				className={`${styles.mapImage}`}
				src={photos[currentPhotoIndex].src}
				alt={photos[currentPhotoIndex].alt}
			/>
		</>
	);
}
