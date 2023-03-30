import { useNavigate } from "react-router-dom";

export default function NotFound() {
	const navigate = useNavigate();

	return (
		<>
			<h1>DNUOF TON</h1>
			<button onClick={() => {
				navigate("/");
			}}>HOME PAGE</button>
		</>
	);
}
