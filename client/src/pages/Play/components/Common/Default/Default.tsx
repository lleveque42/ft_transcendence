import { useState } from "react";
import styles from "./Default.module.scss";

interface DefaultProps {
	joinQueue: () => void;
}

export function Default({ joinQueue }: DefaultProps) {
	const [hasBeenClicked, setHasBeenClicked] = useState<Boolean>(false);

	return (
		<>
			<div className="title">
				Pong <h2 className="underTitle mb-20">Game</h2>
			</div>
			<a
				href={"play"}
				className={`${styles.btn} d-flex flex-column justify-content align-items`}
				onClick={(e) => {
					setHasBeenClicked(!hasBeenClicked);
					e.preventDefault();
					let tID = setTimeout(function () {
						window.clearTimeout(tID);
						joinQueue();
					}, 250);
				}}
			>
				<p
					className={`${hasBeenClicked ? styles.clickedText : styles.btnText}`}
				>
					Find game
				</p>
				<div
					className={`${hasBeenClicked ? styles.clickedBtn2 : styles.btnTwo}`}
				>
					<p
						className={`${
							hasBeenClicked ? styles.clickedText2 : styles.btnText2
						}`}
					>
						<i className="fa-solid fa-gamepad"></i>
					</p>
				</div>
			</a>
		</>
	);
}
