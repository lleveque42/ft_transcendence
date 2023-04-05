import useAuth from "./useAuth";

export default function useLogout() {
	const { setAuth } = useAuth();

	const logout = async () => {
		try {
			const res = await fetch("http://localhost:3000/auth/logout", {
				method: "POST",
				credentials: "include",
			});
			if (res.status === 204) setAuth("");
		} catch (e) {
			console.error("Error logout: ", e);
		}
	};
	return logout;
}
