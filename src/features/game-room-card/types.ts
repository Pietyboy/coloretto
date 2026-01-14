export type TPlayer = {
  nickname: string;
  playerId: number;
  turnNumber: number;
};

export type TGame = {
  currentPlayersCount: number;
  currentTurnPlayer: string;
  gameId: number;
  gameName: string;
  name?: string;
  isFinished: boolean;
  maxPlayerCount: number;
  players: TPlayer[];
  startingDate: string;
  turnDuration: number;
};

export type CreatePlayerFormValues = {
  nickname: string;
};
