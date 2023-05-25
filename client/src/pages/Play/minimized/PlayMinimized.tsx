import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PlayMinimized() {
	const navigate = useNavigate();

	function handleVisibilityChange() {
		if (document.visibilityState === "visible") navigate("/play");
	}

	useEffect(() => {
		if (document.visibilityState === "visible") navigate("/play");
		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	});

	return <div></div>;
}
