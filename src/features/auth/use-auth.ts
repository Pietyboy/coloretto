import { useEffect, useRef } from 'react';

import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../../shared/lib/auth-storage';
import { useRefreshSessionMutation } from '../../store/api/auth-api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setAuthChecked, setAuthToken, setUsername } from '../../store/slices/profile-slice';

const extractAccessToken = (data: undefined | { accessToken?: string; token?: string }) =>
  data?.accessToken ?? data?.token ?? null;

export const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const [refreshSession, { isLoading }] = useRefreshSessionMutation();
  const authChecked = useAppSelector(state => state.profile.authChecked);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || authChecked) return;
    initialized.current = true;

    const storedAuth = getStoredAuth();
    if (storedAuth?.token) {
      dispatch(setAuthToken(storedAuth.token));
      if (storedAuth.username) {
        dispatch(setUsername(storedAuth.username));
      }
      dispatch(setAuthChecked(true));
      return;
    }

    const run = async () => {
      try {
        const data = await refreshSession().unwrap();
        const token = extractAccessToken(data);
        if (token) {
          dispatch(setAuthToken(token));
          setStoredAuth(token, data?.username);
        }
        if (data?.username) {
          dispatch(setUsername(data.username));
        }
      } catch (err) {
        dispatch(setAuthToken(null));
        clearStoredAuth();
      } finally {
        dispatch(setAuthChecked(true));
      }
    };

    void run();
  }, [authChecked, dispatch, refreshSession]);

  return { isLoading: isLoading && !authChecked };
};

export const useAuthState = () => {
  const token = useAppSelector(state => state.profile.authToken);
  const username = useAppSelector(state => state.profile.username);
  const authChecked = useAppSelector(state => state.profile.authChecked);

  return {
    authChecked,
    isAuth: Boolean(token),
    token,
    username,
  };
};
