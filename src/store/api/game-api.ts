import { baseApi } from './base-api';
import { TCard, TChooseColorsQuery, TChooseColorsResult, TChooseJokerColorsQuery, TCreateGameApi, TCreateGameQuery, TCreatePlayerQuery, TCreatePlayerResult, TDeleteGameResult, TGameActionApiQuery, TGameActionApiResult, TGameApi, TGameScoresApi, TGameStateApi, TJoinGameQuery, TJoinGameResult } from './types';

export type TPlayerForGameResponse = {
  inGame: boolean;
  nickname?: string;
  player_id?: number;
};

export const gameApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    chooseColors: builder.mutation<TChooseColorsResult, TChooseColorsQuery>({
      invalidatesTags: (_result, _error, { gameId }) => [{ id: gameId, type: 'Game' }],
      query: body => ({
        body,
        method: 'POST',
        url: '/game/choose-colors',
      }),
    }),
    chooseJokerColors: builder.mutation<TGameActionApiResult, TChooseJokerColorsQuery>({
      invalidatesTags: (_result, _error, { gameId }) => [{ id: gameId, type: 'Game' }],
      query: body => ({
        body,
        method: 'POST',
        url: '/game/joker/colors',
      }),
    }),
    createGame: builder.mutation<TCreateGameApi, TCreateGameQuery>({
      invalidatesTags: ['Game'],
      query: body => ({
        body,
        method: 'POST',
        url: '/game/create/game',
      }),
    }),
    createNewPlayer: builder.mutation<TCreatePlayerResult, TCreatePlayerQuery>({
      invalidatesTags: (_result, _error, { gameId }) => ['Game', { id: gameId, type: 'Player' }],
      query: body => ({
        body,
        method: 'POST',
        url: '/game/create-player',
      }),
    }),
    deleteGame: builder.mutation<TDeleteGameResult, TGameActionApiQuery>({
      invalidatesTags: ['Game'],
      query: body => ({
        body,
        method: 'POST',
        url: '/game/delete',
      }),
    }),
    getGameCard: builder.query<TCard, { cardId: number; gameId: number }>({
      query: ({ cardId, gameId }) => ({
        url: `/game/${gameId}/card/${cardId}`,
      }),
    }),
    getGameScores: builder.query<TGameScoresApi, number>({
      query: gameId => ({
        url: `/game/score/${gameId}`,
      }),
    }),
    getGamesList: builder.query<TGameApi[], void>({
      providesTags: ['Game'],
      query: () => ({
        url: '/game/list',
      }),
    }),
    getGameState: builder.query<TGameStateApi, number>({
      providesTags: (result, error, gameId) => [{ id: gameId, type: 'Game' }],
      query: gameId => ({
        url: `/game/state/${gameId}`,
      }),
    }),
    getHostedGames: builder.query<TGameApi[], void>({
      providesTags: ['Game'],
      query: () => ({
        url: '/game/hosted',
      }),
    }),
    getPlayerForGame: builder.query<TPlayerForGameResponse, number>({
      providesTags: (_result, _error, gameId) => [{ id: gameId, type: 'Player' }],
      query: gameId => ({
        url: `/game/me/${gameId}`,
      }),
    }),
    joinGame: builder.mutation<TJoinGameResult, TJoinGameQuery>({
      invalidatesTags: (_result, _error, { gameId }) => ['Game', { id: gameId, type: 'Player' }],
      query: body => ({
        body,
        method: 'POST',
        url: '/game/join',
      }),
    }),
    makeTurnCard: builder.mutation<unknown, { gameId: number; playerId: number; rowId: number }>({
      invalidatesTags: (result, error, { gameId }) => [{ id: gameId, type: 'Game' }],
      query: body => ({
        body,
        method: 'POST',
        url: '/game/turn/card',
      }),
    }),
    makeTurnRow: builder.mutation<unknown, { gameId: number; playerId: number; rowId: number }>({
      invalidatesTags: (result, error, { gameId }) => [{ id: gameId, type: 'Game' }],
      query: body => ({
        body,
        method: 'POST',
        url: '/game/turn/row',
      }),
    }),
    pauseGame: builder.mutation<TGameActionApiResult, TGameActionApiQuery>({
      invalidatesTags: (result, error, { gameId }) => [{ id: gameId, type: 'Game' }],
      query: body => ({
        body,
        method: 'POST',
        url: '/game/pause',
      }),
    }),
    resumeGame: builder.mutation<TGameActionApiResult, TGameActionApiQuery>({
      invalidatesTags: (result, error, { gameId }) => [{ id: gameId, type: 'Game' }],
      query: body => ({
        body,
        method: 'POST',
        url: '/game/resume',
      }),
    }),
    startGame: builder.mutation<TGameActionApiResult, TGameActionApiQuery>({
      invalidatesTags: (result, error, { gameId }) => [{ id: gameId, type: 'Game' }],
      query: body => ({
        body,
        method: 'POST',
        url: '/game/start',
      }),
    }),
  }),
});

export const {
  useChooseColorsMutation,
  useChooseJokerColorsMutation,
  useCreateGameMutation,
  useCreateNewPlayerMutation,
  useDeleteGameMutation,
  useGetGameCardQuery,
  useGetGameScoresQuery,
  useGetGamesListQuery,
  useGetGameStateQuery,
  useGetHostedGamesQuery,
  useGetPlayerForGameQuery,
  useJoinGameMutation,
  useLazyGetGameCardQuery,
  useLazyGetPlayerForGameQuery,
  useMakeTurnCardMutation,
  useMakeTurnRowMutation,
  usePauseGameMutation,
  useResumeGameMutation,
  useStartGameMutation,
} = gameApi;
