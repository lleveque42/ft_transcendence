import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./assets/styles/index.scss";
import Router from "./router";
import { AuthProvider } from "./context/AuthProvider";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);
root.render(
	<React.StrictMode>
		<AuthProvider>
			<BrowserRouter>
				<Router />
			</BrowserRouter>
		</AuthProvider>
	</React.StrictMode>,
);

reportWebVitals();
