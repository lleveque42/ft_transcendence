import { useEffect, useState } from "react";
import Loader from "react-loaders";
import { getAllUsersRequest } from "../../api";
import { useUser } from "../../context";

export default function Users() {
	const { accessToken } = useUser();
	const [isLoading, setIsloading] = useState<boolean>(true);
	const [usersList, setUsersList] = useState<{ userName: string }[]>([]);

	useEffect(() => {
		async function getAllUsers() {
			const res = await getAllUsersRequest(accessToken);
			if (res.ok) {
				const data = await res.json();
				setUsersList(data);
				console.log(data);
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
			) : (
				<>
					<h2 className="underTitle mt-20 mb-20">Find Friends</h2>
					<div className="flex-1">LIST</div>
				</>
			)}
		</>
	);
}
