import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { InputNumber as AntInputNumber } from 'antd';

export type InputNumberProps = ComponentPropsWithoutRef<typeof AntInputNumber>;
type InputNumberRef = ElementRef<typeof AntInputNumber>;

export const InputNumber = forwardRef<InputNumberRef, InputNumberProps>((props, ref) => (
  <AntInputNumber ref={ref} {...props} />
));

InputNumber.displayName = 'InputNumber';
