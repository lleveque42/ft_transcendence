import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export default function Login42() {
	const [searchParams] = useSearchParams();
	const code = searchParams.get("code");
	// const navigate = useNavigate();

	useEffect(() => {
		async function sendCode() {
			try {
				if (!code) throw new Error("No code finded");
				const response = await fetch(
					`http://localhost:3000/auth/login42/${code}`,
					{
						method: "GET",
						// credentials: "include",
						// headers: {
						// 	"Content-Type": "application/json",
						// },
					},
				);
				if (response.ok) {
					console.log("OK");
					// navigate("/");
				} else if (response.status === 403) alert("Credentials incorrect");
			} catch (e) {
				console.error(e);
			}
		}
		sendCode();
	}, []);

	return (
		<div className="container">
			<h2>Login42 Page</h2>
			<p>code from 42api: {code}</p>
			<p>Waiting...</p>
		</div>
	);
}
