import { createContext, useContext, useState } from "react";
import { isAuthRequest, logoutRequest } from "../api";
import { UserStatus } from "../types/UserStatus.enum";

type UserContextValue = {
	isAuth: () => Promise<boolean>;
	logout: () => void;
	accessToken: string;
	user: {
		userName: string;
		email: string;
		firstName: string;
		lastName: string;
		isTfaEnable: boolean;
		status: UserStatus;
		friends: { userName: string, status: UserStatus }[];
	};
};

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
		status: UserStatus.ONLINE,
		friends: [],
	},
});

type UserProviderProps = {
	children: React.ReactNode;
};

type UserDataState = {
	userName: string;
	email: string;
	firstName: string;
	lastName: string;
	isTfaEnable: boolean;
	status: UserStatus;
	friends: { userName: string, status: UserStatus }[];
};

export const UserProvider = ({ children }: UserProviderProps) => {
	const [accessToken, setAccessToken] = useState<string>("");
	const [user, setUser] = useState<UserDataState>({
		userName: "",
		email: "",
		firstName: "",
		lastName: "",
		isTfaEnable: false,
		status: UserStatus.ONLINE,
		friends: [],
	});

	const isAuth = async (): Promise<boolean> => {
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
