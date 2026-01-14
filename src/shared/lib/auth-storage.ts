type StoredAuth = {
  token: string;
  username?: string;
};

const STORAGE_KEY = 'coloretto-auth';

const isBrowser = () => typeof window !== 'undefined';

const safeParseJson = (value: null | string) => {
  if (!value) return null;
  try {
    return JSON.parse(value) as StoredAuth;
  } catch {
    return null;
  }
};

export const getStoredAuth = (): null | StoredAuth => {
  if (!isBrowser()) return null;
  return safeParseJson(window.localStorage.getItem(STORAGE_KEY));
};

export const setStoredAuth = (token: string, username?: string) => {
  if (!isBrowser()) return;
  const payload: StoredAuth = username ? { token, username } : { token };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const clearStoredAuth = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
};
