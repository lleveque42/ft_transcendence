import { useSearchParams } from "react-router-dom";

export default function Login42() {
	const [searchParams, setSearchParams] = useSearchParams();
	const code = searchParams.get("code");

	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">PONG</div>
			<h2 className="underTitle mb-30">Login42 Page</h2>
			<p className="mb-30">code from 42api: {code}</p>
		</div>
	);
}
