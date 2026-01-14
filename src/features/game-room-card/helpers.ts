import { MONTHS_SHORT } from './constants';

type ApiError = {
  data?: {
    error?: string;
    message?: string;
  };
  error?: string;
  message?: string;
};

export const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as ApiError;
  return apiError.data?.error || apiError.data?.message || apiError.error || apiError.message || fallback;
};

export const hasTextError = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const getGameDate = (date: string) => {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return '—';
  }

  const day = parsedDate.getDate();
  const month = MONTHS_SHORT[parsedDate.getMonth()];
  const year = parsedDate.getFullYear();
  const currentYear = new Date().getFullYear();

  return year === currentYear ? `${day} ${month}` : `${day} ${month} ${year}`;
};
