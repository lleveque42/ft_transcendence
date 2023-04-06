import { ReactElement, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

export default function PrivateRoute(props: {
	element: ReactElement;
}): ReactElement {
	const isAuth = useAuth();
	// const refresh = useRefreshToken();


	return isAuth ? props.element : <Navigate to="/login" />;

}
