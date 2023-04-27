import { useEffect } from "react";
import default_avatar from "../assets/images/punk.png";
import { userAvatarRequest } from "../api";

export default function useAvatar(
	accessToken: string,
	setUserAvatar: React.Dispatch<React.SetStateAction<string>>,
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
	username: string
) {
	useEffect(() => {
		async function getAvatar() {
			try {
				const res = await userAvatarRequest(accessToken, username);
				if (res.ok) {
					if (res.headers.get("content-type") === "application/octet-stream") {
						const data = await res.blob();
						setUserAvatar(URL.createObjectURL(data));
					} else if (res.headers.get("content-type")?.includes("text/html")) {
						const data = await res.text();
						setUserAvatar(data);
					} else {
						console.log("Can't load avatar, default avatar is used");
						setUserAvatar(default_avatar);
					}
				} else {
					console.error("Can't load avatar, default avatar is used");
					setUserAvatar(default_avatar);
				}
			} catch (e) {
				console.error("Error get User Avatar", e);
			}
			setIsLoading(false);
		}
		getAvatar();
	}, [accessToken, setUserAvatar, setIsLoading, username]);
}
