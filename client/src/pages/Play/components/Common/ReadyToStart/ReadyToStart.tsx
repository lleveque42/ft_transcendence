import Loader from "react-loaders";

export default function ReadyToStart() {
	return (
		<>
			<div className="underTitle">Waiting for other player...</div>
			<div>
				<Loader type="ball-zig-zag" innerClassName="nobody-loader" active />
			</div>
		</>
	);
}
