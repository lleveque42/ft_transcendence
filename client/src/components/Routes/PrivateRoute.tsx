import { ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "react-loaders";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useUser } from "../../context";
import { Socket, io } from "socket.io-client";
import { PrivateRouteSocketContext } from "../../context/PrivateRouteProvider";
import { GameSocketContext } from "../../pages/Play/context/GameSocketProvider";

export default function PrivateRoute(props: {
	element: ReactElement;
	play?: boolean | false;
}): ReactElement {
	const { user, isAuth } = useUser();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [gameSocket, setGameSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const checkAuth = async () => {
			const auth = await isAuth();
			setIsAuthenticated(auth);
		};
		checkAuth();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated]);

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

	useEffect(() => {
		let gameSocket: Socket;
		if (isAuthenticated !== null && isAuthenticated && props.play) {
			gameSocket = io(`${process.env.REACT_APP_GAME_GATEWAY_URL}`, {
				query: {
					email: user.email,
				},
			});
			setGameSocket(gameSocket);
		}
		return () => {
			if (gameSocket) gameSocket.disconnect();
		};
	}, [isAuthenticated, user.email, props.play]);

	if (isAuthenticated === null) {
		return (
			<Loader
				type="line-scale-pulse-out"
				innerClassName="container d-flex align-items"
				active
			/>
		);
	}

	const elem = (
		<div className="container d-flex justify-content flex-column">
			<Header />
			{props.element}
			<Footer />
		</div>
	);

	return isAuthenticated ? (
		<PrivateRouteSocketContext.Provider value={{ socket }}>
			{props.play ? (
				<GameSocketContext.Provider value={{ gameSocket }}>
					{elem}
				</GameSocketContext.Provider>
			) : (
				elem
			)}
		</PrivateRouteSocketContext.Provider>
	) : (
		<Navigate to="/login" />
	);
}
