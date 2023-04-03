import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
	const [cookie, , removeCookie] = useCookies(["_jwt"]);
	const navigate = useNavigate();

	// useEffect(() => {
	// 	if (!cookie["_jwt"]) navigate("/login");
	// });

	return (
		<div className="container">
			<h2>Homepage</h2>
			<p>COOKIE : {cookie['_jwt']}|</p>
			<button
				className="btn btn-primary"
				onClick={() => {
					// removeCookie("_jwt", { path: "/" });
					navigate("/login");
				}}
			>
				Login
			</button>
		</div>
	);
}
