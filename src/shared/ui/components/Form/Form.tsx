import type { ReactElement, ReactNode } from 'react';

import type { FormProps as AntFormProps, FormInstance } from 'antd';
import { Form as AntForm } from 'antd';

const toCssSize = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

export type FormProps<Values extends object = Record<string, unknown>> = Omit<
  AntFormProps<Values>,
  'children'
> & {
  children?: ReactNode;
  width?: number | string;
};
export type { FormInstance };

const FormComponent = <Values extends object = Record<string, unknown>>(props: FormProps<Values>) => {
  const { style, width, ...rest } = props;
  const widthValue = width ?? (style as undefined | { width?: number | string })?.width ?? '100%';
  const mergedStyle = { ...style, width: toCssSize(widthValue) };

  return <AntForm {...rest} style={mergedStyle} />;
};

type FormWithStatics = typeof AntForm &
  (<Values extends object = Record<string, unknown>>(props: FormProps<Values>) => ReactElement);

// Сохраняем статические свойства антовской формы (Form.Item, useForm и т.д.)
export const Form = Object.assign(FormComponent, AntForm) as FormWithStatics;
