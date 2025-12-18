import type { CSSProperties } from 'react';

import { NotificationItem } from './NotificationItem';
import type { Notification } from './types';

type Props = {
  items: Notification[];
  onRemove: (id: string) => void;
};

export const NotificationContainer = ({ items, onRemove }: Props) => {
  return (
    <div style={containerStyle}>
      {items.map(item => (
        <NotificationItem
          key={item.id}
          item={item}
          onClose={onRemove}
        />
      ))}
    </div>
  );
};

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  position: 'fixed',
  right: 16,
  top: 16,
  zIndex: 1000,
};
