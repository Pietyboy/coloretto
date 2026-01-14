export type NotificationType = 'error' | 'info' | 'success' | 'warning';

export type NotificationContextValue = {
  notify: (type: NotificationType, message: string) => void;
};

