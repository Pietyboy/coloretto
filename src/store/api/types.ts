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
    players: TPlayer[],
    currentTurnStartTime: string,
    isGameFinished: boolean
}

export type TGameStateApi = {
    state: TGameState
}
