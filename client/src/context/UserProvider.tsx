import { createContext, useContext, useState } from "react";
import { isAuthRequest, logoutRequest } from "../api";

interface UserContextValue {
	isAuth: () => Promise<boolean>;
	logout: () => void;
	accessToken: string;
	user: {
		userName: string;
		email: string;
		firstName: string;
		lastName: string;
		isTfaEnable: boolean;
	};
}

const UserContext = createContext<UserContextValue>({
	isAuth: async () => false,
	logout: () => {},
	accessToken: "",
	user: {
		userName: "",
		email: "",
		firstName: "",
		lastName: "",
		isTfaEnable: false,
	},
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
		isTfaEnable: false,
	});

	const isAuth = async (): Promise<boolean> => {
		if (accessToken !== "") return true;
		const res = await isAuthRequest();
		if (res && res.ok) {
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
	};

	const logout = async (): Promise<void> => {
		logoutRequest(accessToken);
		setAccessToken("");
	};

	return (
		<UserContext.Provider value={{ isAuth, logout, accessToken, user }}>
			{children}
		</UserContext.Provider>
	);
};
export const useUser = () => useContext(UserContext);
