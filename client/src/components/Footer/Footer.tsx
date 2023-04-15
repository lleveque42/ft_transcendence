import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
// import styles from "./Footer.module.scss";

export default function Footer() {
	const navigate = useNavigate();
	const { logout } = useUser();

	const signout = () => {
		logout();
		navigate("/login");
	};

	async function handleClickDeleteAllDatabase() {
		// To del
		try {
			const res = await fetch("http://localhost:3000/user/temporary_dropdb", {
				method: "DELETE",
				credentials: "include",
			});
			if (res.status === 410) {
				signout();
			}
		} catch (e) {
			console.error("Error remove users DB: ", e);
		}
	}

	return (
		<footer className="d-flex justify-content-space-between">
			<p>Copyright © 2023 ft_transcendence</p>
			<button
				className="btn-danger mr-5"
				onClick={handleClickDeleteAllDatabase}
			>
				Empty users db
			</button>
		</footer>
	);
}
