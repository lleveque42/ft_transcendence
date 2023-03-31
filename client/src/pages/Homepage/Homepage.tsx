import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
	const [cookie, ,removeCookie] = useCookies(["_jwt"]);
	const navigate = useNavigate();

	useEffect(() => {
		if (!cookie["_jwt"]) navigate("/login");
	});

	return (
		<>
			<h2>Homepage</h2>
			{/* <button
				onClick={() => {
					// removeCookie("_jwt", { path: "/" });
					navigate("/login");
				}}
			>
				Log Out
			</button> */}
		</>
	);
}
