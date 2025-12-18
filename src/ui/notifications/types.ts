export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
};

