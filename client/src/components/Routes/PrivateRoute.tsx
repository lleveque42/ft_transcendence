import { ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Loader from "react-loaders";

export default function PrivateRoute(props: {
	element: ReactElement;
}): ReactElement {
	const { isAuth } = useAuth();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		const checkAuth = async () => {
			const auth = await isAuth();
			setIsAuthenticated(auth);
		};
		checkAuth();
	});

	if (isAuthenticated === null) {
		return <Loader type="line-scale-pulse-out" active />;
	}
	return isAuthenticated ? props.element : <Navigate to="/login" />;
}
