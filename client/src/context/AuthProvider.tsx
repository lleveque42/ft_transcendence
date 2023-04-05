import { ReactNode, createContext, useState } from "react";

export type AuthContent = {
	auth: string;
	setAuth: (token: string) => void;
}

const AuthContext = createContext<AuthContent>({auth: "", setAuth: () => {}});

export function AuthProvider({ children }: { children: ReactNode }) {
	const [auth, setAuth] = useState("");

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{children}
		</AuthContext.Provider>
	);
}

export default AuthContext;
