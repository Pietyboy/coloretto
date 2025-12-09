import type { ComponentPropsWithoutRef } from 'react';

import { Spin as AntSpin } from 'antd';
import styled from 'styled-components';

const StyledSpin = styled(AntSpin)`
  .ant-spin-dot-item {
    background-color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export type SpinProps = ComponentPropsWithoutRef<typeof AntSpin>;

export const Spin = (props: SpinProps) => <StyledSpin {...props} />;
