export enum GameUserStatus {
	notConnected,
	alreadyConnected,
	connected,
	inQueue,
	waitingGameStart,
	inGame,
	waitingOpponentReconnection,
	opponentDisconnected,
	gameWinner,
	gameLoser,
}
