import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { Rate as AntRate } from 'antd';

export type RateProps = ComponentPropsWithoutRef<typeof AntRate>;
type RateRef = ElementRef<typeof AntRate>;

export const Rate = forwardRef<RateRef, RateProps>((props, ref) => <AntRate ref={ref} {...props} />);

Rate.displayName = 'Rate';
