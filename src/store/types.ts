export type TCard = {
  cardColor: string;
  cardType: string;
  cardId?: number;
};

export type TPlayerHand = {
  card: TCard;
  cardsCount: number;
};

export type TPlayerInfo = {
  isCurrentTurn: boolean;
  isTurnAvailable: boolean;
  playerHand: null | TPlayerHand[];
  playerId: null | number;
  playerName: null | string;
};

export type TRow = {
  cards: TCard[];
  cardsCount: number;
  isActive: boolean;
  rowId: number;
};

export type TGameState = {
  cardsCount: number;
  currentTurnStartTime: null | string;
  gameId: null | number;
  otherPlayersInfo: TPlayerInfo[];
  playerCount: null | number;
  playerInfo: null | TPlayerInfo;
  rows: TRow[];
  topCard: null | number;
};
