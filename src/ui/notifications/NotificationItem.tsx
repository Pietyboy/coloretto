import { type CSSProperties, useEffect } from 'react';

import type { Notification, NotificationType } from './types';

type Props = {
  item: Notification;
  onClose: (id: string) => void;
};

export const NotificationItem = ({ item, onClose }: Props) => {
  useEffect(() => {
    const timer = window.setTimeout(() => onClose(item.id), 4000);
    return () => window.clearTimeout(timer);
  }, [item.id, onClose]);

  return (
    <button
      onClick={() => onClose(item.id)}
      type="button"
      style={{ ...baseStyle, ...typeStyle[item.type] }}
    >
      {item.message}
    </button>
  );
};

const baseStyle: CSSProperties = {
  border: 'none',
  borderRadius: 6,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  color: '#fff',
  cursor: 'pointer',
  fontSize: 14,
  maxWidth: 320,
  padding: '12px 16px',
  textAlign: 'left',
  userSelect: 'none',
};

const typeStyle: Record<NotificationType, CSSProperties> = {
  error: { backgroundColor: '#c62828' },
  info: { backgroundColor: '#1565c0' },
  success: { backgroundColor: '#2e7d32' },
  warning: { backgroundColor: '#ed6c02' },
};
