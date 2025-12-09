import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { TimePicker as AntTimePicker } from 'antd';

export type TimePickerProps = ComponentPropsWithoutRef<typeof AntTimePicker>;
type TimePickerRef = ElementRef<typeof AntTimePicker>;

const BaseTimePicker = forwardRef<TimePickerRef, TimePickerProps>((props, ref) => (
  <AntTimePicker ref={ref} {...props} />
));

BaseTimePicker.displayName = 'TimePicker';

export const TimePicker = Object.assign(BaseTimePicker, {
  RangePicker: AntTimePicker.RangePicker,
});
