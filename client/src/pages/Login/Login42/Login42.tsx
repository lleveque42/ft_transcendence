import { useEffect, useRef } from "react";
import Loader from "react-loaders";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useAlert } from "../../../context";
import { callback42 } from "../../../api";

export default function Login42() {
	const [searchParams] = useSearchParams();
	const code = searchParams.get("code");
	const { showAlert } = useAlert();
	const navigate = useNavigate();
	const ref = useRef(false);

	useEffect(() => {
		async function sendCode() {
			try {
				if (!code) throw new Error("No code provided");
				const res = await callback42(code);
				if (res.status === 201) {
					navigate("/settings");
					showAlert(
						"success",
						"Welcome ! You can customize your profile on this page",
					);
				} else if (res.ok) {
					if (res.headers.get("WWW-Authenticate") === "TFA") {
						const data = await res.json();
						navigate("/verify", { state: { accessToken: data.access_token } });
					} else {
						navigate("/");
						showAlert("success", "Welcome back !");
					}
				} else {
					const body = await res.json();
					console.error("Error login42:", res.status, body.message);
					navigate("/login");
					showAlert("error", "Can't log with 42 account, try again later");
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
			<Loader type="line-scale-pulse-out" active />
		</div>
	);
}
