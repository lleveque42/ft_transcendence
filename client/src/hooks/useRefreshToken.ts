import { useCookies } from "react-cookie";
import useAuth from "./useAuth";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

export default function useRefreshToken() {
	// const { setAuth } = useContext(AuthContext);
	const [cookie] = useCookies(["_jwt"]);

	// Temporary func, need to backend call
	if (cookie["_jwt"]) {
		return cookie._jwt;
	}
	return "";
}
