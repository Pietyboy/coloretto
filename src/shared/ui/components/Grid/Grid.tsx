import { PropsWithChildren } from 'react';

import { GridCol, GridRow } from './grid.styled';
import type { GridItemProps, GridProps } from './types';

const toGutter = (gap: number | undefined): GridProps['gutter'] => {
  if (!gap) return 0;
  const value = gap * 4;
  return [value, value];
};

export const Grid = ({ children, gap, gutter, ...rowProps }: PropsWithChildren<GridProps>) => (
  <GridRow gutter={gutter ?? toGutter(gap)} {...rowProps}>
    {children}
  </GridRow>
);

export const GridItem = ({ children, ...colProps }: PropsWithChildren<GridItemProps>) => (
  <GridCol {...colProps}>{children}</GridCol>
);
