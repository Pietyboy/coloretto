import { useEffect } from 'react';

import { notify } from '../../notifications/NotificationProvider';

export const GlobalErrorListener = () => {
  useEffect(() => {
    const handleError = () => notify('error', 'Произошла ошибка');
    const handleRejection = () => notify('error', 'Произошла ошибка');

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return null;
};
