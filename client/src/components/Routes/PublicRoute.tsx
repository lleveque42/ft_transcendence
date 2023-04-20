import { ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import Loader from "react-loaders";

export default function PublicRoute(props: {
	element: ReactElement;
}): ReactElement {
	const { isAuth } = useUser();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		const checkAuth = async () => {
			const auth = await isAuth();
			setIsAuthenticated(auth);
		};
		checkAuth();
	});
	if (isAuthenticated === null) {
		return (
			<Loader
				type="line-scale-pulse-out"
				innerClassName="container d-flex align-items"
				active
			/>
		);
	}
	return isAuthenticated ? <Navigate to="/" /> : props.element;
}
