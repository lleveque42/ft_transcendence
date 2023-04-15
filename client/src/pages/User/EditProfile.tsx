import { useUser } from "../../context/UserProvider";

export default function EditProfile() {
	const { accessToken, user } = useUser();

	async function testfetch() {
		try {
			const res = await fetch("http://localhost:3000/user/test", {
				credentials: "include",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			const data = await res.text();
			console.log(data);
		} catch (e) {
			console.error("Eroor test edit profile");
		}
	}

	return (
		<div className="d-flex flex-column align-items justify-content flex-1">
			<h1>Edit User Profile</h1>
			<p>{user.userName}</p>
			<button className="btn btn-primary p-10" onClick={testfetch}>
				TEST
			</button>
		</div>
	);
}
