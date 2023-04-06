import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import useRefreshToken from "./useRefreshToken";

export default function useAuth() {
	// return useContext(AuthContext);
	const { auth, setAuth } = useContext(AuthContext);
	const refresh = useRefreshToken();
	console.log("Refresh: ", refresh);
	refresh === "" ? setAuth("") : setAuth("ok");
	return refresh === "" ? false : true;
}
