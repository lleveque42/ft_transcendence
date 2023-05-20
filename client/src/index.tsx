import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./assets/styles/index.scss";
import Router from "./router";
import { BrowserRouter } from "react-router-dom";
import { AlertProvider, UserProvider } from "./context";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<UserProvider>
				<AlertProvider>
					<Router />
				</AlertProvider>
			</UserProvider>
		</BrowserRouter>
	</React.StrictMode>,
);

reportWebVitals();
