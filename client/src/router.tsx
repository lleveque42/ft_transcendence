import { Route, Routes } from "react-router-dom";
import App from "./App";
import NotFound from "./components/NotFound";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/Login/Login";
import Login42 from "./pages/Login/Login42/Login42";
import PrivateRoute from "./components/Routes/PrivateRoute";
import PublicRoute from "./components/Routes/PublicRoute";
import DirectMessages from "./pages/DirectMessages/DirectMessages";
import Channels from "./pages/Channels/Channels";
import Channel from "./pages/Channels/Channel/Channel";
import NewChannel from "./pages/Channels/NewChannel/NewChannel";
import Settings from "./pages/User/Settings/Settings";
import VerifyTfa from "./pages/Login/VerifyTfa/VerifyTfa";
import Profile from "./pages/User/Profile/Profile";
import JoinChannel from "./pages/Channels/JoinChannel/JoinChannel";
import NewDM from "./pages/DirectMessages/NewDirectMessage/NewDM";
import DirectMessage from "./pages/DirectMessages/DirectMessage/DirectMessage";
import Users from "./pages/Users/Users";
import EditChannel from "./pages/Channels/EditChannel/EditChannel";
import Play from "./pages/Play/Play";
import PlayMinimized from "./pages/Play/minimized/PlayMinimized";
import Signup from "./pages/Signup/Signup";

export default function Router() {
	return (
		<Routes>
			<Route element={<App />}>
				<Route path="/login" element={<PublicRoute element={<Login />} />} />
				<Route path="/signup" element={<PublicRoute element={<Signup />} />} />
				<Route
					path="/verify"
					element={<PublicRoute element={<VerifyTfa />} />}
				/>
				<Route
					path="/login42"
					element={<PublicRoute element={<Login42 />} />}
				/>
				<Route path="/" element={<PrivateRoute element={<Homepage />} />} />
				<Route
					path="/settings"
					element={<PrivateRoute element={<Settings />} />}
				/>
				<Route
					path="/user/:username"
					element={<PrivateRoute element={<Profile />} />}
				/>
				<Route
					path="/play"
					element={<PrivateRoute element={<Play />} play={true} />}
				/>
				<Route
					path="/playMinimized"
					element={<PrivateRoute element={<PlayMinimized />} />}
				/>
				<Route
					path="/chat/direct_messages"
					element={<PrivateRoute element={<DirectMessages />} />}
				/>
				<Route
					path="/chat/direct_messages/:id"
					element={<PrivateRoute element={<DirectMessage />} />}
				/>
				<Route
					path="/chat/direct_messages/new_dm"
					element={<PrivateRoute element={<NewDM />} />}
				/>
				<Route
					path="/chat/channels"
					element={<PrivateRoute element={<Channels />} />}
				/>
				<Route
					path="/chat/channels/:id"
					element={<PrivateRoute element={<Channel />} />}
				/>
				<Route
					path="/chat/channels/new_channel"
					element={<PrivateRoute element={<NewChannel />} />}
				/>
				<Route
					path="/chat/channels/join_channel"
					element={<PrivateRoute element={<JoinChannel />} />}
				/>
				<Route
					path="/chat/channels/edit_channel/:title"
					element={<PrivateRoute element={<EditChannel />} />}
				/>
				<Route path="/users" element={<PrivateRoute element={<Users />} />} />
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
}
