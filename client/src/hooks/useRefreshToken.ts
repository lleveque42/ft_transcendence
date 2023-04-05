import { useCookies } from "react-cookie";
import useAuth from "./useAuth";

export default function useRefreshToken() {
	const { setAuth } = useAuth();
	const [cookie] = useCookies(["_jwt"]);

	// Temporary func
	const refresh = () => {
		if (cookie["_jwt"]) {
			setAuth("ok");
		} else {
			setAuth("");
			throw new Error("Pas cookie")
		}
	};
	return refresh;
}
