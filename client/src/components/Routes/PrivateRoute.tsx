import { ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "react-loaders";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useUser } from "../../context";

export default function PrivateRoute(props: {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated]);

	if (isAuthenticated === null) {
		return (
			<Loader
				type="line-scale-pulse-out"
				innerClassName="container d-flex align-items"
				active
			/>
		);
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
