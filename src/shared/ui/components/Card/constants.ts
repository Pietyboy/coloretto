import { css } from 'styled-components';

import { CardElevation, CardPadding, CardVariant } from './types';

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
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
  `,
  muted: css`
    background: ${({ theme }) => theme.colors.surfaceMuted};
    border: 1px solid rgba(255, 255, 255, 0.03);
  `,
  solid: css`
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.surfaceMuted};
  `,
};

export const CARD_ELEVATIONS: CardElevation[] = [0, 1, 2, 3];
