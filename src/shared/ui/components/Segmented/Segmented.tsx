import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { Segmented as AntSegmented } from 'antd';

export type SegmentedProps = ComponentPropsWithoutRef<typeof AntSegmented>;
type SegmentedRef = ElementRef<typeof AntSegmented>;

export const Segmented = forwardRef<SegmentedRef, SegmentedProps>((props, ref) => (
  <AntSegmented ref={ref} {...props} />
));

Segmented.displayName = 'Segmented';
