interface DefaultProps {
	joinQueue: () => void;
}

export function Default({ joinQueue }: DefaultProps) {
	return (
		<>
			<div className="title">
				Pong <h2 className="underTitle mb-20">Game</h2>
			</div>
			<button
				className="btn-primary mb-10"
				onClick={() => {
					joinQueue();
				}}
			>
				Play
			</button>
		</>
	);
}
