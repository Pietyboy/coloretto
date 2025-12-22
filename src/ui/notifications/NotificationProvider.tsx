import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { generateNotificationId } from './helpers';
import { NotificationContainer } from './NotificationContainer';
import type { Notification, NotificationContextValue, NotificationType } from './types';

const NotificationContext = createContext<NotificationContextValue | null>(null);

let globalNotify: ((type: NotificationType, message: string) => void) | null = null;

export const notify = (type: NotificationType, message: string) => {
  globalNotify?.(type, message);
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Notification[]>([]);

  const notifyImpl = useCallback((type: NotificationType, message: string) => {
    setItems(prev => [
      ...prev,
      {
        id: generateNotificationId(),
        message,
        type,
      },
    ]);
  }, []);

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(n => n.id !== id));
  }, []);

  const value = useMemo<NotificationContextValue>(() => ({ notify: notifyImpl }), [notifyImpl]);

  useEffect(() => {
    return () => {
      if (globalNotify === notifyImpl) {
        globalNotify = null;
      }
    };
  }, [notifyImpl]);

  globalNotify = notifyImpl;

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer items={items} onRemove={remove} />
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
