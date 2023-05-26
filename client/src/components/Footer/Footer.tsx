import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../../context";
import styles from "./Footer.module.scss";

export default function Footer() {
	return (
		<footer
			className={`${styles.footerContainer} d-flex justify-content align-items`}
		>
			<p className="pl-10 pb-5">Copyright © 2023 ft_transcendence</p>
		</footer>
	);
}
