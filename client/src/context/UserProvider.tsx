import { createContext, useContext, useState } from "react";

interface UsercontextValue {
	isAuth: () => Promise<boolean>;
	logout: () => void;
	accessToken: string;
	user: {
		userName: string;
		email: string;
		firstName: string;
		lastName: string;
	};
}

const UserContext = createContext<UsercontextValue>({
	isAuth: async () => false,
	logout: () => {},
	accessToken: "",
	user: { userName: "", email: "", firstName: "", lastName: "" },
});

interface UserProviderProps {
	children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
	const [accessToken, setAccessToken] = useState<string>("");
	const [user, setUser] = useState({
		userName: "",
		email: "",
		firstName: "",
		lastName: "",
	});

	const isAuth = async (): Promise<boolean> => {
		if (accessToken !== "") return true;
		try {
			const res = await fetch("http://localhost:3000/auth/refresh", {
				credentials: "include",
			});
			if (res.ok) {
				if (res.status === 204) {
					return false;
				}
				const data = await res.json();
				setAccessToken(data.accessToken);
				setUser(data.userData);
				return true;
			} else {
				if (accessToken) logout();
				setAccessToken("");
				return false;
			}
		} catch (e) {
			console.error("Error refresh: ", e);
		}
		return false;
	};

	const logout = async (): Promise<void> => {
		try {
			await fetch("http://localhost:3000/auth/logout", {
				method: "POST",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			setAccessToken("");
		} catch (e) {
			console.error("Error logout: ", e);
		}
	};
	return (
		<UserContext.Provider value={{ isAuth, logout, accessToken, user }}>
			{children}
		</UserContext.Provider>
	);
};
export const useUser = () => useContext(UserContext);
