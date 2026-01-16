import { Layout } from 'antd';
import styled from 'styled-components';

import type { PageVariant } from './Page';

export const PageRoot = styled(Layout)<{ $variant?: PageVariant }>`
  max-width: 1040px;
  margin: 0 auto;
  padding: ${({ $variant, theme }) =>
    $variant === 'game'
      ? `clamp(${theme.spacing(3)}, 3vh, ${theme.spacing(8)}) ${theme.spacing(4)}`
      : `${theme.spacing(10)} ${theme.spacing(4)}`};
  display: flex;
  flex-direction: column;
  gap: ${({ $variant, theme }) =>
    $variant === 'game'
      ? `clamp(${theme.spacing(4)}, 2vh, ${theme.spacing(8)})`
      : theme.spacing(8)};
  background: transparent;
  overflow: ${({ $variant }) => ($variant === 'game' ? 'hidden' : 'visible')};
`;
