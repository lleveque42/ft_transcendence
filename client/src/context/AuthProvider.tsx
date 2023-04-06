import { ReactNode, createContext, useContext, useState } from "react";
import { useCookies } from "react-cookie";

type AuthContent = {
	auth: boolean;
	setAuth: (value: boolean) => void;
	login: () => void;
	logout: () => Promise<void>;
};

const defaultValue = {
	auth: false,
	setAuth: () => {},
	login: async () => {},
	logout: async () => {},
};

const AuthContext = createContext<AuthContent>(defaultValue);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [auth, setAuth] = useState<boolean>(false);
	const [authCookie] = useCookies(["_jwt"]);

	const login = () => {
		// Need to type as Promise ?
		authCookie["_jwt"] ? setAuth(true) : setAuth(false);
		console.log("LOGIN FUNCTION");
		console.log("auth: ", auth);
		console.log("jwt: ", authCookie["_jwt"]);
	};

	const logout = async (): Promise<void> => {
		try {
			const res = await fetch("http://localhost:3000/auth/logout", {
				method: "POST",
				credentials: "include",
			});
			if (res.status === 204) {
				setAuth(false);
			}
		} catch (e) {
			console.error("Error logout: ", e);
		}
	};

	return (
		<AuthContext.Provider value={{ auth, setAuth, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}
export const useAuth = () => useContext(AuthContext);

// import { ReactNode, createContext, useState } from "react";

// export type AuthContent = {
// 	auth: string;
// 	setAuth: (token: string) => void;
// }

// const AuthContext = createContext<AuthContent>({auth: "", setAuth: () => {}});

// export function AuthProvider({ children }: { children: ReactNode }) {
// 	const [auth, setAuth] = useState("");

// 	return (
// 		<AuthContext.Provider value={{ auth, setAuth }}>
// 			{children}
// 		</AuthContext.Provider>
// 	);
// }

// export default AuthContext;
