export enum GameUserStatus {
	notConnected,
	alreadyConnected,
	connected,
	inQueue,
	waitingGameStart,
	waitingGameRestart,
	inGame,
	waitingOpponentReconnection,
	opponentDisconnected,
	gameWinner,
	gameLoser,
}
