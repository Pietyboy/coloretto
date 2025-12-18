import { useNotificationContext } from '../ui/notifications/NotificationProvider';
import type { NotificationType } from '../ui/notifications/types';

export const useNotify = () => {
  const { notify } = useNotificationContext();
  return (type: NotificationType, message: string) => {
    notify(type, message);
  };
};

