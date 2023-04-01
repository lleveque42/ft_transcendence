import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export default function Login42() {
	const [searchParams] = useSearchParams();
	const code = searchParams.get("code");
	const navigate = useNavigate();

	useEffect(() => {
		async function sendCode() {
			try {
				if (!code) throw new Error("No code provided");
				const response = await fetch(
					`http://localhost:3000/auth/token42/${code}`,
				);
				if (response.ok) {
					// console.log(await response.json());
					navigate("/");
				}
				// else...
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
