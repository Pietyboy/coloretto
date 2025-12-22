import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { TGameState, TPlayerInfo, TRow } from '../types'

const initialState: TGameState = {
  cardsCount: 76,
  currentTurnStartTime: '',
  gameId: null,
  otherPlayersInfo: [],
  playerCount: null,
  playerInfo: {
    isCurrentTurn: false,
    isTurnAvailable: false,
    playerHand: [],
    playerId: -1,
    playerName: '',
  },
  rows: [],
  topCard: undefined,
  turnDuration: 40
}

export const gameSlice = createSlice({
  initialState,
  name: 'game',
  reducers: {
    setGameState: (_state, action: PayloadAction<Partial<TGameState>>) => {
      return { ..._state, ...action.payload }
    },
    setPlayerHand: (state, action: PayloadAction<TPlayerInfo>) => {
      state.playerInfo = action.payload
    },
    setPlayerInfo: (state, action: PayloadAction<TPlayerInfo>) => {
      state.playerInfo = action.payload
    },
    setRows: (state, action: PayloadAction<TRow[]>) => {
      state.rows = action.payload
    }
  }
})

export const { setGameState, setPlayerHand, setPlayerInfo, setRows } = gameSlice.actions

export default gameSlice.reducer;
