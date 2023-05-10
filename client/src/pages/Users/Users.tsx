import { useEffect, useState } from "react";
import Loader from "react-loaders";
import { getAllUsersRequest } from "../../api";
import { useUser } from "../../context";
import { Friend, UserStatus } from "../../types";

type UsersList = {
	userName: string;
	isFriend: boolean;
	status: UserStatus | null;
};

export default function Users() {
	const { accessToken, user } = useUser();
	const [isLoading, setIsloading] = useState<boolean>(true);
	const [usersList, setUsersList] = useState<any>([]);

	function cleanUsersList(data: any) {
		// console.log(data);
		let list: UsersList[] = [];
		list = data
			.filter((u: UsersList) => u.userName !== user.userName)
			.map((u: UsersList) => {
				const friend: Friend | undefined = user.friends.find(
					(f: any) => f.userName === u.userName,
				);
				if (friend) {
					u.isFriend = true;
					u.status = friend.status;
				} else {
					u.isFriend = false;
					u.status = null;
				}
				return u;
			});
		console.log(list);
		setUsersList(list);
	}

	useEffect(() => {
		async function getAllUsers() {
			const res = await getAllUsersRequest(accessToken);
			if (res.ok) {
				const data = await res.json();
				cleanUsersList(data);
			}
			setIsloading(false);
		}
		getAllUsers();
	}, []);

	return (
		<>
			{isLoading ? (
				<Loader
					type="line-scale-pulse-out"
					innerClassName="container d-flex align-items private-loader"
					active
				/>
			) : !usersList.length ? (
				<h1 className="flex-1">Nobody</h1>
			) : (
				<>
					<h2 className="underTitle mt-20 mb-20">Find Friends</h2>
					<div className="flex-1">LIST</div>
				</>
			)}
		</>
	);
}
