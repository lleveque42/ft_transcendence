import React from "react";
// import { Route, Routes } from "react-router-dom";
// import Layout from "./components/Layout";
// import Login from "./components/Login";
// import NotFound from "./components/NotFound";
// import Signup from "./components/Signup";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Outlet } from "react-router-dom";

export default function App() {
	return (
		<div>
			{/* <div className="appContainer"> */}
			<Header />
			{/* <div> */}
				<Outlet />
			{/* </div> */}
			<Footer />
		</div>
	);
}
