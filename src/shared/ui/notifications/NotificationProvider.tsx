import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';

import { notification } from 'antd';

import {
  NOTIFICATION_DURATION_SECONDS,
  NOTIFICATION_MAX_COUNT,
  NOTIFICATION_PLACEMENT,
} from './constants';
import { generateNotificationId } from './helpers';
import { NotificationContent } from './NotificationContent';
import type { NotificationContextValue, NotificationType } from './types';

const NotificationContext = createContext<NotificationContextValue | null>(null);

let globalNotify: ((type: NotificationType, message: string) => void) | null = null;

export const notify = (type: NotificationType, message: string) => {
  globalNotify?.(type, message);
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [api, contextHolder] = notification.useNotification({
    duration: NOTIFICATION_DURATION_SECONDS,
    maxCount: NOTIFICATION_MAX_COUNT,
    placement: NOTIFICATION_PLACEMENT,
  });

  const notifyImpl = useCallback(
    (type: NotificationType, message: string) => {
      const key = generateNotificationId();

      api.open({
        className: 'coloretto-notification',
        closable: false,
        key,
        message: (
          <NotificationContent
            message={message}
            type={type}
            onClose={() => api.destroy(key)}
          />
        ),
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      });
    },
    [api]
  );

  const value = useMemo<NotificationContextValue>(() => ({ notify: notifyImpl }), [notifyImpl]);

  useEffect(() => {
    globalNotify = notifyImpl;
    return () => {
      if (globalNotify === notifyImpl) {
        globalNotify = null;
      }
    };
  }, [notifyImpl]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {contextHolder}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('NotificationProvider is missing');
  }
  return ctx;
};
