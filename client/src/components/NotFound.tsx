import { useNavigate } from "react-router-dom";

export default function NotFound() {
	const navigate = useNavigate();

	return (
		<div className="container d-flex flex-column justify-content align-items">
			<h1>DNUOF TON</h1>
			<button className="btn btn-primary p-5 mt-10" onClick={() => {
				navigate("/");
			}}>HOME PAGE</button>
		</div>
	);
}
