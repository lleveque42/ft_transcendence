import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Signup from "./components/Signup";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				{/* PUBLIC ROUTES */}
				<Route path="login" element={<Login />} />
				<Route path="signup" element={<Signup />} />


				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
}

export default App;
