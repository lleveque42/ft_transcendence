import { ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "react-loaders";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useUser } from "../../context";
import { Socket, io } from "socket.io-client";
import { PrivateRouteSocketContext } from "../../context/PrivateRouteProvider";

export default function PrivateRoute(props: {
	element: ReactElement;
}): ReactElement {
	const { user, isAuth } = useUser();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const checkAuth = async () => {
			const auth = await isAuth();
			setIsAuthenticated(auth);
		};
		checkAuth();
	}, [isAuth]);

	useEffect(() => {
		let appSocket: Socket;
		if (isAuthenticated !== null && isAuthenticated) {
			appSocket = io(`${process.env.REACT_APP_APP_GATEWAY_URL}`, {
				query: {
					email: user.email,
				},
			});
			setSocket(appSocket);
		}
		return () => {
			if (appSocket) appSocket.disconnect();
		};
	}, [isAuthenticated, user.email]);

	if (isAuthenticated === null) {
		return (
			<Loader
				type="line-scale-pulse-out"
				innerClassName="container d-flex align-items"
				active
			/>
		);
	}

	const privateRouteSocketContextValue = { socket };

	return isAuthenticated ? (
		<PrivateRouteSocketContext.Provider value={privateRouteSocketContextValue}>
			<div className="container d-flex justify-content flex-column">
				<Header />
				{props.element}
				<Footer />
			</div>
		</PrivateRouteSocketContext.Provider>
	) : (
		<Navigate to="/login" />
	);
}
