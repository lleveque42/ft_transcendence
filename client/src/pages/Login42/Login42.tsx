import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

export default function Login42() {
	const [searchParams] = useSearchParams();
	const code = searchParams.get("code");
	const navigate = useNavigate();
	const ref = useRef(false);
	const { login } = useAuth();

	useEffect(() => {
		async function sendCode() {
			try {
				if (!code) throw new Error("No code provided");
				const res = await fetch(
					`http://localhost:3000/auth/callback42/${code}`,
					{
						credentials: "include",
					},
				);
				if (res.status === 201) {
					// login from context
					login();
					navigate("/editprofile"); // Redirect to user edit profile when its first co
				} else if (res.ok) {
					// login from context
					login();
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
		if (!ref.current) {
			sendCode();
		}
		return () => {
			ref.current = true;
		};
	});

	return (
		<div className="container d-flex flex-column align-items justify-content">
			<h2 className="mb-20">Asking Xav for 42 connexion</h2>
			<p>Waiting...</p>
		</div>
	);
}
