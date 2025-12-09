import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { DatePicker as AntDatePicker } from 'antd';

export type DatePickerProps = ComponentPropsWithoutRef<typeof AntDatePicker>;
type DatePickerRef = ElementRef<typeof AntDatePicker>;

const BaseDatePicker = forwardRef<DatePickerRef, DatePickerProps>((props, ref) => (
  <AntDatePicker ref={ref} {...props} />
));

BaseDatePicker.displayName = 'DatePicker';

export const DatePicker = Object.assign(BaseDatePicker, {
  RangePicker: AntDatePicker.RangePicker,
});
