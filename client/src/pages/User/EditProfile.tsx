import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
	const navigate = useNavigate();
	const [cookie, , removeCookie] = useCookies(["_jwt"]);

	return (
		<div className="container d-flex flex-column align-items justify-content">
			<h1>Edit User Profile</h1>
			<p>Page test</p>
			<p>COOKIE : {cookie["_jwt"]}</p>
			<button
				className="btn btn-primary"
				onClick={() => {
					navigate("/login");
				}}
			>
				Back to Login
			</button>
			<button
				className="btn btn-primary"
				onClick={() => {
					navigate("/");
				}}
			>
				Homepage
			</button>
		</div>
	);
}
