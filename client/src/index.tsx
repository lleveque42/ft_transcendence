import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./assets/styles/index.scss";
import Router from "./router";
import { UserProvider } from "./context/UserProvider";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<UserProvider>
				<Router />
			</UserProvider>
		</BrowserRouter>
	</React.StrictMode>,
);

reportWebVitals();
