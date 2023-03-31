import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export default function Login42() {
	const [searchParams, setSearchParams] = useSearchParams();
	const code = searchParams.get("code");
	const navigate = useNavigate();

	async function sendCode() {
		try {
			const response = await fetch("http://localhost:3000/auth/login42", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ code }),
			});
			if (response.ok) {
				console.log("OK");
				// navigate("/");
			} else if (response.status === 403) alert("Credentials incorrect");
		} catch (e) {
			console.error("ERROR FETCH");
		}
	}
	sendCode();

	return (
		<div className="container">
			<h2>Login42 Page</h2>
			<p>code from 42api: {code}</p>
		</div>
	);
}
