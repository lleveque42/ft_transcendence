import { useNavigate } from "react-router-dom";

export default function VerifyTfa() {
	const navigate = useNavigate();
	return (
		<div className="container">
			<h1>VERIFY</h1>
			<button
				className="btn btn-primary"
				onClick={() => {
					navigate("/login");
				}}
			>
				Login
			</button>
		</div>
	);
}
