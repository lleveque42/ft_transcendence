import { ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Loader from "react-loaders";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

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
		return <Loader type="line-scale-pulse-out" innerClassName="container d-flex align-items" active />;
	}
	return isAuthenticated ? (
		<div className="container d-flex justify-content flex-column">
			<Header />
			{props.element}
			<Footer />
		</div>
	) : (
		<Navigate to="/login" />
	);
}
