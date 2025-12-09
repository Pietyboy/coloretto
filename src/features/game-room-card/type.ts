type TPlayer = {
  playerId: number,
  nickname: string,
  turnNumber: number
}

export type TGame = {
  currentPlayersCount: number;
  currentTurnPlayer: string;
  gameId: number;
  gameName: string;
  isFinished: boolean;
  maxPlayerCount: number;
  players: TPlayer[];
  startingDate: string;
  turnDuration: number;
};
