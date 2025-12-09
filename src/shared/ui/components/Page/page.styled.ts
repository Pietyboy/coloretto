import { Layout } from 'antd';
import styled from 'styled-components';

export const PageRoot = styled(Layout)`
  min-height: 100vh;
  max-width: 1040px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(10)} ${({ theme }) => theme.spacing(4)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(8)};
  background: transparent;
`;
