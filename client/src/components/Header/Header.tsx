import React from "react";
import styles from "./Header.module.scss";

export default function Header() {
	return (
		<header>
			<div
				className={`${styles.headerContainer} d-flex align-items justify-content`}
			>
				<h2 className={`${styles.title}`}>FT_TRANSCENDENCE</h2>
				<button/>
			</div>
		</header>
	);
}
