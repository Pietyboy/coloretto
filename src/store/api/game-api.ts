import { baseApi } from './base-api';
import { TCard, TGameApi, TGameStateApi } from './types';

export const gameApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createGame: builder.mutation<{ gameId: number }, { gameName: string; maxSeatsCount: number; turnTime: number }>({
      invalidatesTags: ['Game'],
      query: body => ({
        body,
        method: 'POST',
        url: '/game/create/game',
      }),
    }),
    getGameCard: builder.query<TCard, { cardId: number; gameId: number }>({
      query: ({ cardId, gameId }) => ({
        url: `/game/${gameId}/card/${cardId}`,
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
    joinGame: builder.mutation<{ playerId: number; gameId: number; nickname: string }, { gameId: number; nickname: string }>({
      invalidatesTags: ['Game'],
      query: body => ({
        body,
        method: 'POST',
        url: '/game/create/player',
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
  }),
});

export const {
  useCreateGameMutation,
  useGetGameCardQuery,
  useGetGamesListQuery,
  useGetGameStateQuery,
  useJoinGameMutation,
  useLazyGetGameCardQuery,
  useMakeTurnCardMutation,
  useMakeTurnRowMutation,
} = gameApi;
