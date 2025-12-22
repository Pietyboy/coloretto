import styled from 'styled-components';

import { CARD_PADDING_STYLES, CARD_VARIANT_STYLES } from './constants';
import type { CardElevation, CardPadding, CardVariant } from './types';

export type CardStyleProps = {
  elevation?: CardElevation;
  fullHeight?: boolean;
  fullWidth?: boolean;
  height?: number | string;
  overflow?: boolean;
  padding?: CardPadding;
  variant?: CardVariant;
  width?: number | string;
};

type CardRootProps = {
  $elevation?: CardElevation;
  $fullHeight?: boolean;
  $fullWidth?: boolean;
  $height?: number | string;
  $overflow?: boolean;
  $padding?: CardPadding;
  $variant?: CardVariant;
  $width?: number | string;
};

export const CardRoot = styled.div<CardRootProps>`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  box-shadow: ${({ $elevation = 1, theme }) => theme.elevation[$elevation].shadow};
  width: ${({ $fullWidth, $width }) =>
    $fullWidth ? '100%' : $width ? (typeof $width === 'number' ? `${$width}px` : $width) : 'auto'};
  height: ${({ $fullHeight, $height }) =>
    $fullHeight ? '100%' : $height ? (typeof $height === 'number' ? `${$height}px` : $height) : 'auto'};
  transition: transform ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base};
  overflow: ${({ $overflow = false }) => ($overflow ? 'hidden' : 'visible')};

  ${({ $variant = 'solid' }) => CARD_VARIANT_STYLES[$variant]}
  ${({ $padding = 'md' }) => CARD_PADDING_STYLES[$padding]}
`;
