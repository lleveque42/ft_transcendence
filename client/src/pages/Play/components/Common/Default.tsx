interface DefaultProps {
	showUsers: () => void; // tmp
	joinQueue: (again: boolean) => void;
}

export function Default({ showUsers, joinQueue }: DefaultProps) {
	return (
		<>
			<div className="title">
				Pong <h2 className="underTitle mb-20">Game</h2>
			</div>
			<button className="btn-primary mb-10" onClick={showUsers}>
				Show users
			</button>
			<button
				className="btn-primary mb-10"
				onClick={() => {
					joinQueue(false);
				}}
			>
				Play
			</button>
		</>
	);
}
