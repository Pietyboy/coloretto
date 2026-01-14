import type { ComponentProps, CSSProperties } from 'react';

import { Typography as AntTypography } from 'antd';
import { useTheme } from 'styled-components';

import type { ColorettoTheme } from '../../themes/types';

import type { FontWeight, HeadingLevel, TextAlign, TextSize, TextTone } from './types';

const { Paragraph, Text: AntText, Title } = AntTypography;

const weightMap: Record<FontWeight, number> = {
  bold: 700,
  medium: 500,
  regular: 400,
  semibold: 600,
};

const textSizeMap: Record<TextSize, CSSProperties> = {
  large: { fontSize: '2.5rem', lineHeight: 0.5 },
  medium: { fontSize: '1.5rem', lineHeight: 1.4 },
  regular: { fontSize: '1rem', lineHeight: 1.5 },
  small: { fontSize: '0.875rem', lineHeight: 1.5 },
  tiny: { fontSize: '0.75rem', lineHeight: 1.5 },
};

const resolveToneColor = (theme: ColorettoTheme, tone: TextTone) => {
  const tokenColor = theme.components?.typography?.tones?.[tone];
  if (tokenColor) {
    return tokenColor;
  }

  switch (tone) {
    case 'accent':
      return theme.colors.accent;
    case 'danger':
      return theme.colors.danger;
    case 'muted':
      return theme.colors.surfaceMuted;
    case 'secondary':
      return theme.colors.textSecondary;
    case 'success':
      return theme.colors.success;
    case 'warning':
      return theme.colors.warning;
    default:
      return theme.colors.textPrimary;
  }
};

export interface HeadingProps
  extends Omit<ComponentProps<typeof Title>, 'level'> {
  align?: TextAlign;
  level?: HeadingLevel;
  tone?: TextTone;
  uppercase?: boolean;
}

const Heading = ({
  align = 'left',
  level = 2,
  style,
  tone = 'default',
  uppercase = false,
  ...rest
}: HeadingProps) => {
  const theme = useTheme() as ColorettoTheme;
  const mergedStyle: CSSProperties = {
    color: resolveToneColor(theme, tone),
    margin: 0,
    textAlign: align,
    textTransform: uppercase ? 'uppercase' : undefined,
    ...style,
  };

  return <Title level={level} {...rest} style={mergedStyle} />;
};

export interface TextProps extends ComponentProps<typeof AntText> {
  align?: TextAlign;
  as?: 'paragraph' | 'text';
  block?: boolean;
  size?: TextSize;
  tone?: TextTone;
  uppercase?: boolean;
  weight?: FontWeight;
}

const textComponentMap = {
  paragraph: Paragraph,
  text: AntText,
} as const;

const Text = ({
  align = 'left',
  as = 'text',
  block = false,
  size = 'regular',
  style,
  tone = 'default',
  uppercase = false,
  weight = 'regular',
  ...rest
}: TextProps) => {
  const theme = useTheme() as ColorettoTheme;
  const typographyStyle = textSizeMap[size];
  const mergedStyle: CSSProperties = {
    color: resolveToneColor(theme, tone),
    display: block ? 'block' : undefined,
    fontSize: typographyStyle.fontSize,
    fontWeight: weightMap[weight],
    lineHeight: typographyStyle.lineHeight,
    margin: 0,
    textAlign: align,
    textTransform: uppercase ? 'uppercase' : undefined,
    ...style,
  };

  const Component = textComponentMap[as];

  return <Component {...rest} style={mergedStyle} />;
};

export const Typography = Object.assign({}, AntTypography, {
  Heading,
  Text,
});
