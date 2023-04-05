import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
// import useLogout from "../hooks/useLogout";

export default function PersistLogin() {
	const { auth } = useAuth();
	const refresh = useRefreshToken();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	// const logout = useLogout();

	const signout = () => {
		// await logout();
		navigate("/login");
	};

	useEffect(() => {
		const verifyRefreshToken = async () => {
			try {
				refresh();
			} catch (e) {
				// console.error("Error Verify Refresh Token :", e);
				signout();
			} finally {
				setIsLoading(false);
			}
		};
		auth === "" ? verifyRefreshToken() : setIsLoading(false);
	}, [auth, refresh, signout]);

	// useEffect(() => {
	//     console.log(`isLoading: ${isLoading}`)
	//     console.log(`auth: ${auth}`)
	// }, [isLoading])

	return <>{isLoading ? <p>Loading !</p> : <Outlet />}</>;
}
