import { Flex as AntdFlex } from 'antd';
import styled from 'styled-components';

import type { FlexAlign, FlexDirection, FlexJustify } from './types';

export type FlexStyleProps = {
  direction?: FlexDirection;
  gap?: number;
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: boolean;
  $fullWidth?: boolean;
  $fullHeight?: boolean;
  marginBottom?: number;
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
};

export const FlexRoot = styled(AntdFlex).attrs<FlexStyleProps>(
  ({ align = 'stretch', direction = 'column', height, justify = 'start',width, wrap}) => ({
    align,
    height,
    justify,
    vertical: direction !== 'row',
    width,
    wrap
  })
)<FlexStyleProps>`
  width: ${({ $fullWidth, width }) =>
    $fullWidth ? '100%' : width ? (typeof width === 'number' ? `${width}px` : width) : 'auto'};
  height: ${({ $fullHeight, height }) =>
    $fullHeight ? '100%' : height ? (typeof height === 'number' ? `${height}px` : height) : 'auto'};
  flex-direction: ${({ direction = 'column' }) => (direction === 'row' ? 'row' : 'column')} !important;
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'nowrap')};
  gap: ${({ gap = 0, theme }) => theme.spacing(gap)};
  margin-bottom: ${({ marginBottom, theme }) => marginBottom ? theme.spacing(marginBottom) : 0};
  min-width: ${({ minWidth }) => (
    minWidth !== undefined && minWidth !== null
      ? typeof minWidth === 'number'
        ? `${minWidth}px`
        : minWidth
      : undefined
  )};
  max-width: ${({ maxWidth }) => (
    maxWidth !== undefined && maxWidth !== null
      ? typeof maxWidth === 'number'
        ? `${maxWidth}px`
        : maxWidth
      : undefined
  )};
  min-height: ${({ minHeight }) => (
    minHeight !== undefined && minHeight !== null
      ? typeof minHeight === 'number'
        ? `${minHeight}px`
        : minHeight
      : undefined
  )};
  max-height: ${({ maxHeight }) => (
    maxHeight !== undefined && maxHeight !== null
      ? typeof maxHeight === 'number'
        ? `${maxHeight}px`
        : maxHeight
      : undefined
  )};
`;
