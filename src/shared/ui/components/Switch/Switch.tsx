import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { Switch as AntSwitch } from 'antd';

export type SwitchProps = ComponentPropsWithoutRef<typeof AntSwitch>;
type SwitchRef = ElementRef<typeof AntSwitch>;

export const Switch = forwardRef<SwitchRef, SwitchProps>((props, ref) => <AntSwitch ref={ref} {...props} />);

Switch.displayName = 'Switch';
