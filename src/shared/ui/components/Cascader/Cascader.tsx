import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { Cascader as AntCascader } from 'antd';

export type CascaderProps = ComponentPropsWithoutRef<typeof AntCascader>;
type CascaderRef = ElementRef<typeof AntCascader>;

const BaseCascader = forwardRef<CascaderRef, CascaderProps>((props, ref) => (
  <AntCascader ref={ref} {...props} />
));

BaseCascader.displayName = 'Cascader';

export const Cascader = Object.assign(BaseCascader, {
  Panel: AntCascader.Panel,
});
