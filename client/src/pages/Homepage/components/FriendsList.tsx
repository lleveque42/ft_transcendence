import { useUser } from "../../../context";

export default function FriendsList() {
	const {user} = useUser()

	return (
		<>
			<h3 className="underTitle mt-10">My Friends</h3>
			{user.friends.length !== 0 ? (

				<ul className="mt-20 pl-5">
				{user.friends.map((f, i) => (
					<li key={i}>{f.userName}</li>
					))}
			</ul>

			) : <h3>Empty</h3>}
		</>
	);
}
