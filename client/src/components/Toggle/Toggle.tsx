import { useState } from "react";
import styles from "./Toggle.module.scss";

interface ToggleProps {
	toggled: boolean;
	onClick: () => void;
}

export const Toggle = ({ toggled, onClick }: ToggleProps) => {
	const [isToggled, toggle] = useState(toggled);

	const callback = () => {
		toggle(!isToggled);
		onClick();
	};

	return (
		<div className="mt-5 ml-10">
			<label className={`${styles.toggleLabel}`}>
				<input
					className={`${styles.toggleInput}`}
					type="checkbox"
					defaultChecked={isToggled}
					onClick={callback}
				/>
				<span className={`${styles.toggleSpan}`} />
			</label>
		</div>
	);
};
