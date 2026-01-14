import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { clearActiveGames } from '../../shared/lib/active-games';
import { clearStoredAuth, setStoredAuth } from '../../shared/lib/auth-storage';
import { logout, setAuthToken, setUsername } from '../slices/profile-slice';

const API_BASE_URL = process.env.REACT_APP_API_URL ?? '/api';

type AuthResponse = {
  accessToken?: string;
  token?: string;
  username?: string;
};

const extractAccessToken = (data: AuthResponse | undefined) => data?.accessToken ?? data?.token ?? null;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as { profile?: { authToken?: null | string } };
    const token = state?.profile?.authToken;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

let refreshRequest: null | ReturnType<typeof rawBaseQuery> = null;

const baseQueryWithReauth: BaseQueryFn<FetchArgs | string, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const url = typeof args === 'string' ? args : args.url;
  const isAuthRequest = url.startsWith('/auth');
  const state = api.getState() as { profile?: { authToken?: null | string } };
  const token = state?.profile?.authToken;

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401 || isAuthRequest || !token) {
    return result;
  }

  if (!refreshRequest) {
    refreshRequest = rawBaseQuery({ method: 'POST', url: '/auth/refresh' }, api, extraOptions);
  }

  const refreshResult = await refreshRequest;
  refreshRequest = null;

  if (!refreshResult.data) {
    clearActiveGames();
    clearStoredAuth();
    api.dispatch(logout());
    return result;
  }

  const authData = refreshResult.data as AuthResponse;
  const newToken = extractAccessToken(authData);

  if (!newToken) {
    clearActiveGames();
    clearStoredAuth();
    api.dispatch(logout());
    return result;
  }

  api.dispatch(setAuthToken(newToken));
  setStoredAuth(newToken, authData?.username);

  if (authData?.username) {
    api.dispatch(setUsername(authData.username));
  }

  result = await rawBaseQuery(args, api, extraOptions);
  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  reducerPath: 'api',
  tagTypes: ['Auth', 'Game', 'Player']
});

export type BaseApiError = {
  data?: { code?: string; details?: unknown; message?: string };
  status?: number;
};
