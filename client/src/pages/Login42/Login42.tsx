import { error } from "console";
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
				const res = await fetch(
					`http://localhost:3000/auth/callback42/${code}`,
				);
				if (res.status === 201) {
					navigate("/signup"); // Redirect to user edit profile when its first co
				} else if (res.ok) {
					navigate("/");
				} else {
					const body = await res.json();
					console.error("Error login42:", res.status, body.message);
					navigate("/login");
				}
			} catch (e) {
				console.error("Error login42: ", e);
				navigate("/login");
			}
		}
		sendCode();
	}, [code]);

	return (
		<div className="container d-flex flex-column align-items justify-content">
			<h2 className="mb-20">Asking Xav for 42 connexion</h2>
			<p>Waiting...</p>
			<button
				className="btn btn-primary"
				onClick={() => {
					navigate("/login");
				}}
			>
				Back to Login
			</button>
		</div>
	);
}
