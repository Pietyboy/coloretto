import type { ReactElement, ReactNode } from 'react';

import type { FormProps as AntFormProps, FormInstance } from 'antd';
import { Form as AntForm } from 'antd';
import { useTheme } from 'styled-components';

import type { ColorettoTheme } from '../../themes/types';
import type { CardPadding } from '../Card/types';

const toCssSize = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

const PADDING_FACTORS: Record<CardPadding, number> = {
  lg: 6,
  md: 4,
  none: 0,
  sm: 3,
};

export type FormProps<Values extends object = Record<string, unknown>> = Omit<
  AntFormProps<Values>,
  'children'
> & {
  children?: ReactNode;
  padding?: CardPadding;
  width?: number | string;
};
export type { FormInstance };

const FormComponent = <Values extends object = Record<string, unknown>>(props: FormProps<Values>) => {
  const theme = useTheme() as ColorettoTheme;
  const { padding, style, width, ...rest } = props;
  const widthValue = width ?? (style as undefined | { width?: number | string })?.width ?? '100%';
  const paddingStyle = padding ? { padding: theme.spacing(PADDING_FACTORS[padding]) } : undefined;
  const mergedStyle = { ...style, ...paddingStyle, width: toCssSize(widthValue) };

  return <AntForm {...rest} style={mergedStyle} />;
};

type FormWithStatics = typeof AntForm &
  (<Values extends object = Record<string, unknown>>(props: FormProps<Values>) => ReactElement);

// Сохраняем статические свойства антовской формы (Form.Item, useForm и т.д.)
export const Form = Object.assign(FormComponent, AntForm) as FormWithStatics;
