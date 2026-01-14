import { css } from 'styled-components';
import type { DefaultTheme } from 'styled-components';

import { CardElevation, CardPadding, CardVariant } from './types';

const resolveVariantTokens = (theme: DefaultTheme, variant: CardVariant) =>
  theme.components?.card?.variants?.[variant];

export const CARD_PADDING_STYLES: Record<CardPadding, ReturnType<typeof css>> = {
  lg: css`
    padding: ${({ theme }) => theme.spacing(6)};
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing(4)};
  `,
  none: css`
    padding: 0;
  `,
  sm: css`
    padding: ${({ theme }) => theme.spacing(3)};
  `,
};

export const CARD_VARIANT_STYLES: Record<CardVariant, ReturnType<typeof css>> = {
  glass: css`
    background: ${({ theme }) =>
      resolveVariantTokens(theme, 'glass')?.background ?? 'rgba(255, 255, 255, 0.05)'};
    border: 1px solid
      ${({ theme }) =>
        resolveVariantTokens(theme, 'glass')?.borderColor ?? 'rgba(255, 255, 255, 0.08)'};
    backdrop-filter: ${({ theme }) =>
      resolveVariantTokens(theme, 'glass')?.backdropFilter ?? 'blur(10px)'};
  `,
  muted: css`
    background: ${({ theme }) =>
      resolveVariantTokens(theme, 'muted')?.background ?? theme.colors.surfaceMuted};
    border: 1px solid
      ${({ theme }) =>
        resolveVariantTokens(theme, 'muted')?.borderColor ?? 'rgba(255, 255, 255, 0.03)'};
  `,
  solid: css`
    background: ${({ theme }) =>
      resolveVariantTokens(theme, 'solid')?.background ?? theme.colors.surface};
    border: 1px solid
      ${({ theme }) =>
        resolveVariantTokens(theme, 'solid')?.borderColor ?? theme.colors.surfaceMuted};
  `,
};

export const CARD_ELEVATIONS: CardElevation[] = [0, 1, 2, 3];
