import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.REACT_APP_API_URL ?? '/api';

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { profile?: { authToken?: null | string } };
      const token = state?.profile?.authToken;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    }
  }),
  endpoints: () => ({}),
  reducerPath: 'api',
  tagTypes: ['Auth', 'Game', 'Player']
});

export type BaseApiError = {
  data?: { code?: string; details?: unknown; message?: string };
  status?: number;
};
