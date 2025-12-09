import type { ComponentPropsWithoutRef } from 'react';

import { ColorPicker as AntColorPicker } from 'antd';

export type ColorPickerProps = ComponentPropsWithoutRef<typeof AntColorPicker>;

export const ColorPicker = (props: ColorPickerProps) => <AntColorPicker {...props} />;
