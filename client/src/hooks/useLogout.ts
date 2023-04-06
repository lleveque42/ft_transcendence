import { useContext } from "react";
import useAuth from "./useAuth";
import AuthContext from "../context/AuthProvider";

export default function useLogout() {
	const { setAuth } = useContext(AuthContext);

	const logout = async () => {
		try {
			const res = await fetch("http://localhost:3000/auth/logout", {
				method: "POST",
				credentials: "include",
			});
			if (res.status === 204){
				setAuth("");
			}
		} catch (e) {
			console.error("Error logout: ", e);
		}
	};
	return logout;
}
