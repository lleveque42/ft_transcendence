import { Route, Routes } from "react-router-dom";
import App from "./App";
import NotFound from "./components/NotFound";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/Login/Login";
import Login42 from "./pages/Login42/Login42";
import Signup from "./pages/Signup/Signup";
import EditProfile from "./pages/User/EditProfile";
import PrivateRoute from "./components/PrivateRoute";

// export default function Router() {
// 	return (
// 		<Routes>
// 			<Route element={<App />}>
// 				{/* Public routes */}
// 				<Route path="/login" element={<Login />} />
// 				<Route path="/signup" element={<Signup />} />
// 				<Route path="/login42" element={<Login42 />} />
// 				{/* </Route> */}

// 				<Route element={<PersistLogin />}>
// 					{/* Need to be log Routes */}
// 					<Route path="/" element={<Homepage />} />
// 					<Route path="/editprofile" element={<EditProfile />} />
// 				</Route>

// 				<Route path="*" element={<NotFound />} />
// 			</Route>
// 		</Routes>
// 	);
// }

export default function Router() {
	return (
		<Routes>
			<Route element={<App />}>
				{/* Public routes */}
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/login42" element={<Login42 />} />

				<Route path="/" element={<PrivateRoute element={<Homepage />} />} />

				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
}
