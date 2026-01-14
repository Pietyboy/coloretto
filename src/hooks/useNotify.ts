import { useNotificationContext } from '../shared/ui/notifications/NotificationProvider';
import type { NotificationType } from '../shared/ui/notifications/types';

export const useNotify = () => {
  const { notify } = useNotificationContext();
  return (type: NotificationType, message: string) => {
    notify(type, message);
  };
};
