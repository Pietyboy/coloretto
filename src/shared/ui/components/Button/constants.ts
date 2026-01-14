import type { DefaultTheme } from 'styled-components';
import { css } from 'styled-components';

import { ButtonSize, ButtonVariant } from './types';

const resolveVariantTokens = (theme: DefaultTheme, variant: ButtonVariant) =>
  theme.components?.button?.variants?.[variant];

const resolveVariantValue = (
  theme: DefaultTheme,
  variant: ButtonVariant,
  key: 'background' | 'borderColor' | 'boxShadow' | 'color' | 'opacity' | 'transform',
  fallback: number | string
) => resolveVariantTokens(theme, variant)?.[key] ?? fallback;

const resolveVariantStateValue = (
  theme: DefaultTheme,
  variant: ButtonVariant,
  state: 'active' | 'hover',
  key: 'background' | 'borderColor' | 'boxShadow' | 'color' | 'opacity' | 'transform',
  fallback: number | string
) => resolveVariantTokens(theme, variant)?.[state]?.[key] ?? fallback;

const resolveSizeTokens = (theme: DefaultTheme, size: ButtonSize) =>
  theme.components?.button?.sizes?.[size];

const resolveSizeValue = (
  theme: DefaultTheme,
  size: ButtonSize,
  key: 'font' | 'height' | 'paddingX',
  fallback: string
) => resolveSizeTokens(theme, size)?.[key] ?? fallback;

export const ButtonVariantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  accent: css`
    background: ${({ theme }) =>
      resolveVariantValue(theme, 'accent', 'background', theme.colors.buttonSecondary)};
    color: ${({ theme }) => resolveVariantValue(theme, 'accent', 'color', theme.colors.textPrimary)};

    &:hover {
      color: ${({ theme }) => resolveVariantStateValue(theme, 'accent', 'hover', 'color', theme.colors.textSecondary)};
      background: ${({ theme }) =>
        resolveVariantStateValue(theme, 'accent', 'hover', 'background', theme.colors.accent)};
    }

    &:active {
      background: ${({ theme }) =>
        resolveVariantStateValue(theme, 'accent', 'active', 'background', theme.colors.accent)};
    }
  `,
  danger: css`
    background: ${({ theme }) => resolveVariantValue(theme, 'danger', 'background', theme.colors.danger)};
    color: ${({ theme }) => resolveVariantValue(theme, 'danger', 'color', theme.colors.textSecondary)};
    box-shadow: ${({ theme }) =>
      resolveVariantValue(theme, 'danger', 'boxShadow', theme.elevation[1].shadow)};

    &:hover {
      box-shadow: ${({ theme }) =>
        resolveVariantStateValue(theme, 'danger', 'hover', 'boxShadow', theme.elevation[2].shadow)};
      transform: ${({ theme }) =>
        resolveVariantStateValue(theme, 'danger', 'hover', 'transform', 'translateY(-1px)')};
    }

    &:active {
      transform: ${({ theme }) =>
        resolveVariantStateValue(theme, 'danger', 'active', 'transform', 'translateY(0)')};
      box-shadow: ${({ theme }) =>
        resolveVariantStateValue(theme, 'danger', 'active', 'boxShadow', theme.elevation[1].shadow)};
    }
  `,
  ghost: css`
    background: ${({ theme }) => resolveVariantValue(theme, 'ghost', 'background', 'transparent')};
    color: ${({ theme }) => resolveVariantValue(theme, 'ghost', 'color', theme.colors.textPrimary)};

    &:hover {
      color: ${({ theme }) => resolveVariantStateValue(theme, 'ghost', 'hover', 'color', theme.colors.textPrimary)};
      background: ${({ theme }) =>
        resolveVariantStateValue(theme, 'ghost', 'hover', 'background', theme.colors.accent)};
    }

    &:active {
      background: ${({ theme }) =>
        resolveVariantStateValue(theme, 'ghost', 'active', 'background', theme.colors.surface)};
    }
  `,
  outline: css`
    background: ${({ theme }) =>
      resolveVariantValue(theme, 'outline', 'background', theme.colors.surface)};
    color: ${({ theme }) => resolveVariantValue(theme, 'outline', 'color', theme.colors.textSecondary)};
    border: 1px solid
      ${({ theme }) =>
        resolveVariantValue(theme, 'outline', 'borderColor', theme.colors.neutrals[600])};

    &:hover {
      background: ${({ theme }) =>
        resolveVariantStateValue(theme, 'outline', 'hover', 'background', theme.colors.surfaceMuted)};
    }

    &:active {
      background: ${({ theme }) =>
        resolveVariantStateValue(theme, 'outline', 'active', 'background', theme.colors.surface)};
    }
  `,
  outlineSecondary: css`
    background: ${({ theme }) =>
      resolveVariantValue(theme, 'outlineSecondary', 'background', 'transparent')};
    color: ${({ theme }) =>
      resolveVariantValue(theme, 'outlineSecondary', 'color', theme.colors.buttonSecondary)};
    border: none;

    &:hover {
      opacity: ${({ theme }) =>
        resolveVariantStateValue(theme, 'outlineSecondary', 'hover', 'opacity', 0.6)};
    }
  `,
  primary: css`
    background: ${({ theme }) =>
      resolveVariantValue(theme, 'primary', 'background', theme.colors.buttonPrimary)};
    color: ${({ theme }) => resolveVariantValue(theme, 'primary', 'color', theme.colors.textSecondary)};
    box-shadow: ${({ theme }) =>
      resolveVariantValue(theme, 'primary', 'boxShadow', theme.elevation[1].shadow)};

    &:hover {
      box-shadow: ${({ theme }) =>
        resolveVariantStateValue(theme, 'primary', 'hover', 'boxShadow', theme.elevation[2].shadow)};
      transform: ${({ theme }) =>
        resolveVariantStateValue(theme, 'primary', 'hover', 'transform', 'translateY(-1px)')};
    }

    &:active {
      transform: ${({ theme }) =>
        resolveVariantStateValue(theme, 'primary', 'active', 'transform', 'translateY(0)')};
      box-shadow: ${({ theme }) =>
        resolveVariantStateValue(theme, 'primary', 'active', 'boxShadow', theme.elevation[1].shadow)};
    }
  `,
  secondary: css`
    background: ${({ theme }) =>
      resolveVariantValue(theme, 'secondary', 'background', theme.colors.buttonSecondary)};
    color: ${({ theme }) => resolveVariantValue(theme, 'secondary', 'color', theme.colors.textPrimary)};

    &:hover {
      color: ${({ theme }) =>
        resolveVariantStateValue(theme, 'secondary', 'hover', 'color', theme.colors.textSecondary)};
      background: ${({ theme }) =>
        resolveVariantStateValue(theme, 'secondary', 'hover', 'background', theme.colors.buttonPrimary)};
    }

    &:active {
      background: ${({ theme }) =>
        resolveVariantStateValue(theme, 'secondary', 'active', 'background', theme.colors.surfaceMuted)};
    }
  `,
};

export const ButtonSizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  lg: css`
    height: ${({ theme }) => resolveSizeValue(theme, 'lg', 'height', '48px')};
    padding: 0 ${({ theme }) => resolveSizeValue(theme, 'lg', 'paddingX', theme.spacing(4))};
    font: ${({ theme }) => resolveSizeValue(theme, 'lg', 'font', theme.typography.headings.h6)};
  `,
  md: css`
    height: ${({ theme }) => resolveSizeValue(theme, 'md', 'height', '40px')};
    padding: 0 ${({ theme }) => resolveSizeValue(theme, 'md', 'paddingX', theme.spacing(3))};
    font: ${({ theme }) => resolveSizeValue(theme, 'md', 'font', theme.typography.body.regular)};
  `,
  sm: css`
    height: ${({ theme }) => resolveSizeValue(theme, 'sm', 'height', '32px')};
    padding: 0 ${({ theme }) => resolveSizeValue(theme, 'sm', 'paddingX', theme.spacing(2))};
    font: ${({ theme }) => resolveSizeValue(theme, 'sm', 'font', theme.typography.body.small)};
  `,
};
