import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { Radio as AntRadio } from 'antd';

export type RadioProps = ComponentPropsWithoutRef<typeof AntRadio>;
type RadioRef = ElementRef<typeof AntRadio>;

const BaseRadio = forwardRef<RadioRef, RadioProps>((props, ref) => <AntRadio ref={ref} {...props} />);

BaseRadio.displayName = 'Radio';

export const Radio = Object.assign(BaseRadio, {
  Button: AntRadio.Button,
  Group: AntRadio.Group,
});
