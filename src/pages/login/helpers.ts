const DEFAULT_AUTH_ERROR_MESSAGE = 'Не удалось выполнить запрос. Проверьте данные и попробуйте снова.';

type AuthError = {
  data?: {
    error?: string;
    message?: string;
  };
  message?: string;
};

export const getAuthErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object') return DEFAULT_AUTH_ERROR_MESSAGE;

  const apiError = error as AuthError;

  return (
    apiError.data?.error
    || apiError.data?.message
    || apiError.message
    || DEFAULT_AUTH_ERROR_MESSAGE
  );
};
