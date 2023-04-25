import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

type AlertType = "success" | "error" | "info" | "warning";

interface AlertContextType {
	showAlert: (type: AlertType, message: string) => void;
}

interface AlertProviderProps {
	children: ReactNode;
}

interface AlertProps {
	type: AlertType;
	message: string;
}

const AlertContext = createContext<AlertContextType>({
	showAlert: () => {},
});

export const AlertProvider = ({ children }: AlertProviderProps) => {
	const [alert, setAlert] = useState<AlertProps | null>(() => {
		const storedAlert = localStorage.getItem("alert");
		if (storedAlert) return JSON.parse(storedAlert);
		return null;
	});
	const [isHidden, setIsHidden] = useState<boolean>(true);

	const showAlert = (type: AlertType, message: string) => {
		setAlert({ type, message });
		setIsHidden(false);
		localStorage.setItem("alert", JSON.stringify({ type, message }));
	};

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;
		if (alert) {
			setIsHidden(false);
			timeoutId = setTimeout(() => {
				setIsHidden(true);
				setTimeout(() => {
					setAlert(null);
					localStorage.removeItem("alert");
				}, 500);
			}, 3000);
		}

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [alert]);

	return (
		<AlertContext.Provider value={{ showAlert }}>
			{alert && (
				<div
					className={`alert alert-${alert.type} ${isHidden ? "hide" : ""}`}
				>
					{alert.message}
				</div>
			)}
			{children}
		</AlertContext.Provider>
	);
};

export const useAlert = () => useContext(AlertContext);
