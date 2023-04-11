import { createContext, useContext, useState } from "react";

interface AuthContextValue {
	isAuth: () => Promise<boolean>;
	logout: () => void;
	testAuth: string;
}

const AuthContext = createContext<AuthContextValue>({
	isAuth: async () => false,
	logout: () => {},
	testAuth: "",
});

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [testAuth, setTestAuth] = useState<string>("");

	const isAuth = async (): Promise<boolean> => {
		try {
			const res = await fetch("http://localhost:3000/auth/refresh", {
				credentials: "include",
			});
			const data = await res.json();
			if (data.cookie) {
				console.log("DATA RES AUTH:", data);
				setTestAuth(data.test);
				return true;
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
			});
		} catch (e) {
			console.error("Error logout: ", e);
		}
	};
	return (
		<AuthContext.Provider value={{ isAuth, logout, testAuth }}>
			{children}
		</AuthContext.Provider>
	);
};
export const useAuth = () => useContext(AuthContext);
