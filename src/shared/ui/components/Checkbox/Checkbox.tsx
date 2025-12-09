import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { Checkbox as AntCheckbox } from 'antd';

export type CheckboxProps = ComponentPropsWithoutRef<typeof AntCheckbox>;
type CheckboxRef = ElementRef<typeof AntCheckbox>;

const BaseCheckbox = forwardRef<CheckboxRef, CheckboxProps>((props, ref) => (
  <AntCheckbox ref={ref} {...props} />
));

BaseCheckbox.displayName = 'Checkbox';

export const Checkbox = Object.assign(BaseCheckbox, {
  Group: AntCheckbox.Group,
});
