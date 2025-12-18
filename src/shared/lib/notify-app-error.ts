import { notification } from 'antd';

const NOTIFICATION_KEY = 'app-error';
const THROTTLE_MS = 1500;

let lastShownAt = 0;

export const notifyAppError = () => {
  const now = Date.now();
  if (now - lastShownAt < THROTTLE_MS) return;
  lastShownAt = now;

  notification.error({
    key: NOTIFICATION_KEY,
    message: 'Произошла ошибка',
    placement: 'bottomLeft',
  });
};

