import { baseApi } from './base-api';

type AuthResponse = {
  accessToken?: string;
  token?: string;
  username?: string;
  userId?: number | string;
  status?: string;
};

type AuthRequest = {
  username: string;
  password: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, AuthRequest>({
      invalidatesTags: ['Auth'],
      query: body => ({
        body,
        method: 'POST',
        url: '/auth',
      }),
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      invalidatesTags: ['Auth'],
      query: () => ({
        method: 'POST',
        url: '/auth/logout',
      }),
    }),
    refreshSession: builder.mutation<AuthResponse, void>({
      invalidatesTags: ['Auth'],
      query: () => ({
        method: 'POST',
        url: '/auth/refresh',
      }),
    }),
    register: builder.mutation<AuthResponse, AuthRequest>({
      invalidatesTags: ['Auth'],
      query: body => ({
        body,
        method: 'POST',
        url: '/auth/login',
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRefreshSessionMutation, useRegisterMutation } = authApi;
