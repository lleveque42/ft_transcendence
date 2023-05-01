import { Route, Routes } from "react-router-dom";
import App from "./App";
import NotFound from "./components/NotFound";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/Login/Login";
import Login42 from "./pages/Login42/Login42";
import Signup from "./pages/Signup/Signup";
import EditProfile from "./pages/User/EditProfile";
import PrivateRoute from "./components/Routes/PrivateRoute";
import PublicRoute from "./components/Routes/PublicRoute";
import Chat from "./pages/Chat/Chat";
import DirectMessages from "./pages/DirectMessages/DirectMessages";
import Channels from "./pages/Channels/Channels";
import Channel from "./pages/Channels/Channel";
import NewChannel from "./pages/Channels/NewChannel";

export default function Router() {
	return (
		<Routes>
			<Route element={<App />}>
				<Route path="/login" element={<PublicRoute element={<Login />} />} />
				<Route path="/signup" element={<PublicRoute element={<Signup />} />} />
				<Route
					path="/login42"
					element={<PublicRoute element={<Login42 />} />}
				/>
				<Route path="/" element={<PrivateRoute element={<Homepage />} />} />
				<Route
					path="/editprofile"
					element={<PrivateRoute element={<EditProfile />} />}
				/>
				<Route 
					path="/chat"
					element={<PrivateRoute element={<Chat />} />}
				/>
				<Route
					path="/chat/direct_messages"
					element={<PrivateRoute element={<DirectMessages/>} />}					
				/>
				<Route
					path="/chat/direct_messages/:id"
					element={<PrivateRoute element={<DirectMessages/>} />}					
				/>
				<Route
					path="/chat/channels"
					element={<PrivateRoute element={<Channels />} />}					
				/>
				<Route
					path="/chat/channels/new_channel"
					element={<PrivateRoute element={<NewChannel/>} />}					
				/>
				<Route
					path="/chat/channels/:id"
					element={<PrivateRoute element={<Channel/>} />}					
				/>
				<Route
					path="/chat/friends"
					element={<PrivateRoute element={<Chat />} />}					
				/>
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
}
