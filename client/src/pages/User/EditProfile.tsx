import { useUser } from "../../context/UserProvider";

export default function EditProfile() {
	const { accessToken, user } = useUser();

	return (
		<div className="d-flex flex-column align-items justify-content flex-1">
			<h1>Need to become profile page, url /users/userName</h1>
		</div>
	);
}
