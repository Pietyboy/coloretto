import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled,
  WarningFilled,
} from '@ant-design/icons';
import { Alert } from 'antd';
import { useTheme } from 'styled-components';

import { Image, Typography } from '../components';
import type { ColorettoTheme } from '../themes/types';

import type { NotificationType } from './types';

type Props = {
  message: string;
  type: NotificationType;
  onClose: () => void;
};

const getBackgroundColor = (theme: ColorettoTheme, type: NotificationType) => {
  switch (type) {
    case 'error':
      return theme.colors.cardColors.red;
    case 'info':
      return theme.colors.cardColors.blue;
    case 'success':
      return theme.colors.cardColors.green;
    case 'warning':
      return theme.colors.accent;
    default:
      return theme.colors.surface;
  }
};

const withAlpha = (color: string, alpha: number) => {
  const trimmed = color.trim();
  if (!trimmed.startsWith('#')) return trimmed;

  let hex = trimmed.slice(1);
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((part) => `${part}${part}`)
      .join('');
  }
  if (hex.length === 4) {
    hex = hex
      .slice(0, 3)
      .split('')
      .map((part) => `${part}${part}`)
      .join('');
  }
  if (hex.length === 8) {
    hex = hex.slice(0, 6);
  }
  if (hex.length !== 6) return trimmed;

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const getIcon = (type: NotificationType, theme: ColorettoTheme, size: string) => {
  const style = { color: getBackgroundColor(theme, type), fontSize: size };
  switch (type) {
    case 'success':
      return <CheckCircleFilled style={style} />;
    case 'info':
      return <InfoCircleFilled style={style} />;
    case 'warning':
      return <WarningFilled style={style} />;
    case 'error':
    default:
      return <CloseCircleFilled style={style} />;
  }
};

export const NotificationContent = ({ message, onClose, type }: Props) => {
  const theme = useTheme() as ColorettoTheme;
  const backgroundColor = getBackgroundColor(theme, type);
  const iconSize = theme.spacing(5);

  return (
    <Alert
      closable
      closeIcon={<Image variant="closeBlackIcon" width={10} />}
      icon={getIcon(type, theme, iconSize)}
      message={<Typography.Text>{message}</Typography.Text>}
      onClose={onClose}
      showIcon
      style={{
        background: withAlpha(backgroundColor, 0.2),
        border: `none`,
        borderRadius: theme.radii.md,
      }}
      type={type}
    />
  );
};
