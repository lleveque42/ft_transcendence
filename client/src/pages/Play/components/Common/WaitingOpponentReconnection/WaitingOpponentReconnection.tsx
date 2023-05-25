import Loader from "react-loaders";

export default function WaitingOpponentReconnection() {
	return (
		<>
			<div className="underTitle">Waiting for opponent reconnection...</div>
			<div>
				<Loader type="ball-zig-zag" innerClassName="nobody-loader" active />
			</div>
		</>
	);
}
