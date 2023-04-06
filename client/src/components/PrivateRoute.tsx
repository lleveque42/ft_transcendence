import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function PrivateRoute(props: {
	element: ReactElement;
}): ReactElement {
	const { auth } = useAuth();

	console.log("AUTH PRIVATE ROUTE:", auth);

	return auth ? props.element : <Navigate to="/login" />;
}
