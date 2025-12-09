import type { ColProps, RowProps } from 'antd';

export interface GridProps extends Omit<RowProps, 'gutter'> {
  /**
   * Semantic spacing multiplier that will be converted to pixel gutter (factor * 4).
   * Override `gutter` directly to control both axes precisely.
   */
  gap?: number;
  gutter?: RowProps['gutter'];
}

export type GridItemProps = ColProps;
