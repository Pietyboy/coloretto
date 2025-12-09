import { css } from 'styled-components';

import { ButtonSize, ButtonVariant } from './types';

export const ButtonVariantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  accent: css`
    background: ${({ theme }) => theme.colors.buttonSecondary};
    color: ${({ theme }) => theme.colors.textPrimary};

    &:hover {
      color: ${({ theme }) => theme.colors.textSecondary};
      background: ${({ theme }) => theme.colors.accent};
    }

    &:active {
      background: ${({ theme }) => theme.colors.accent};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};

    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
      background: ${({ theme }) => theme.colors.accent};
    }

    &:active {
      background: ${({ theme }) => theme.colors.surface};
    }
  `,
  outline: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textSecondary};
    border: 1px solid ${({ theme }) => theme.colors.neutrals[600]};

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceMuted};
    }

    &:active {
      background: ${({ theme }) => theme.colors.surface};
    }
  `,
  outlineSecondary: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.buttonSecondary};
    border: none;

    &:hover {
      opacity: 0.6;
    }
  `,
  primary: css`
    background: ${({ theme }) => theme.colors.buttonPrimary};
    color: ${({ theme }) => theme.colors.textSecondary};
    box-shadow: ${({ theme }) => theme.elevation[1].shadow};

    &:hover {
      box-shadow: ${({ theme }) => theme.elevation[2].shadow};
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: ${({ theme }) => theme.elevation[1].shadow};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.buttonSecondary};
    color: ${({ theme }) => theme.colors.textPrimary};

    &:hover {
      color: ${({ theme }) => theme.colors.textSecondary};
      background: ${({ theme }) => theme.colors.buttonPrimary};
    }

    &:active {
      background: ${({ theme }) => theme.colors.surfaceMuted};
    }
  `,
};

export const ButtonSizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  lg: css`
    height: 48px;
    padding: 0 ${({ theme }) => theme.spacing(4)};
    font: ${({ theme }) => theme.typography.headings.h6};
  `,
  md: css`
    height: 40px;
    padding: 0 ${({ theme }) => theme.spacing(3)};
    font: ${({ theme }) => theme.typography.body.regular};
  `,
  sm: css`
    height: 32px;
    padding: 0 ${({ theme }) => theme.spacing(2)};
    font: ${({ theme }) => theme.typography.body.small};
  `,
};
