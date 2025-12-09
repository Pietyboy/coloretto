import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { Slider as AntSlider } from 'antd';

export type SliderProps = ComponentPropsWithoutRef<typeof AntSlider>;
type SliderRef = ElementRef<typeof AntSlider>;

export const Slider = forwardRef<SliderRef, SliderProps>((props, ref) => <AntSlider ref={ref} {...props} />);

Slider.displayName = 'Slider';
