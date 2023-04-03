import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import SignupForm from "../../components/Forms/SignupForm/Signup";
import styles from "./Signup.module.scss";

export default function Signup() {
	const navigate = useNavigate();
	const [cookie] = useCookies(["_jwt"]);

	useEffect(() => {
		if (cookie["_jwt"]) navigate("/");
	});

	return (
		<div
			className={`${styles.signupContainer} d-flex flex-column align-items justify-content`}
		>
			<div className="title mb-30">
				PONG<h2 className="underTitle">Signup</h2>
			</div>
			<SignupForm />
		</div>
	);
}
