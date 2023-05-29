import React, { useState, useEffect } from "react";

export default function Countdown() {
	const [countdown, setCountdown] = useState(3);

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prevCountdown) => prevCountdown - 1);
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	return <div className="title mb-30">{countdown}</div>;
}
