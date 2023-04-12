import { ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Loader from "react-loaders";

export default function PublicRoute(props: {
	element: ReactElement;
}): ReactElement {
	const { accessToken } = useAuth();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		accessToken !== "" ? setIsAuthenticated(true) : setIsAuthenticated(false);
	}, [isAuthenticated, accessToken]);

	if (isAuthenticated === null) {
		return <Loader type="line-scale-pulse-out" active />;
	}
	return !isAuthenticated ? props.element : <Navigate to="/" />;
}
