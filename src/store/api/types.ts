type TPlayerApi = {
    playerId: number,
    nickname: string,
    turnNumber: number
}

export type TGameApi = {
    gameId: number,
    gameName: string,
    startingDate: string,
    maxPlayerCount: number,
    turnDuration: number,
    currentPlayersCount: number,
    isFinished: boolean,
    currentTurnPlayer: string,
    gameStatus?: string,
    game_status?: string,
    status?: string,
    players: TPlayerApi[]
}

export type TCard = {
    cardId: number,
    color: string,
    type: string
}

type Row = {
    isActive: boolean,
    rowId: number,
    cards: null | TCard[]
}

export type TPlayer = {
    playerId: number,
    nickname: string,
    turnNumber: number,
    isConnected?: boolean,
    colors: string[],
    hand: null | TCard[],
    isCurrentTurn: boolean
}

export type TGameState = {
    gameId: number,
    startingDate: string,
    maxPlayerCount: number,
    turnDuration: number,
    rows: Row[],
    firstDeckCard: {
        cardId: number
    },
    remainingCardsCount: number,
    players: null | TPlayer[],
    currentTurnStartTime: string,
    isGameFinished: boolean
}

export type TGameStateApi = {
    state: TGameState
}

export type TDeleteGameResult = TCommonApi & Partial<{
    gameId: number;
    message: string;
}>;

export type TCreateGameApi = Partial<{
    error: string;
    gameId: number;
    result: string;
}>;

export type TCreateGameQuery = {
    gameName: string;
    maxSeatsCount: number;
    turnTime: number;
};

export type TCreatePlayerQuery = {
    gameId: number;
    nickname: string;
};

export type TCommonApi = Partial<{
    error: string;
    status: string;
}>;

export type TCreatePlayerResult = TCommonApi & Partial<{
    gameId: number;
    nickname: string;
    playerId: number;
    player_id: number;
}>;

export type TJoinGameQuery = {
    gameId: number;
};

export type TJoinGameResult = TCommonApi & Partial<{
    playerId: number;
    player_id: number;
}>;

export type TGameActionApiResult = TCommonApi & Partial<{
    message: string;
}>;

export type TGameActionApiQuery = {
    gameId: number;
}

export type TChooseColorsQuery = {
    colorIds: number[];
    gameId: number;
    playerId: number;
};

export type TChooseColorsResult = TCommonApi & Partial<{
    player_id: number;
    selected_colors: string[];
    status: string;
}>;

export type TJokerColorChoice = {
    card_id: number;
    color: string;
};

export type TChooseJokerColorsQuery = {
    choices: TJokerColorChoice[];
    gameId: number;
    playerId: number;
};

export type TGameScoresApi = {
    scores: unknown;
};
