export type NotificationType = 'error' | 'info' | 'success' | 'warning';

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
};

export type NotificationContextValue = {
  notify: (type: NotificationType, message: string) => void;
};
