import { createContext, useContext, useState } from "react";

interface AuthContextValue {
	isAuth: () => Promise<boolean>;
	logout: () => void;
	accessToken: string;
}

const AuthContext = createContext<AuthContextValue>({
	isAuth: async () => false,
	logout: () => {},
	accessToken: "",
});

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [accessToken, setAccessToken] = useState<string>("");

	const isAuth = async (): Promise<boolean> => {
		try {
			const res = await fetch("http://localhost:3000/auth/refresh", {
				credentials: "include",
			});
			const data = await res.json();
			if (res.ok) {
				setAccessToken(data.access_token);
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
		<AuthContext.Provider value={{ isAuth, logout, accessToken }}>
			{children}
		</AuthContext.Provider>
	);
};
export const useAuth = () => useContext(AuthContext);
