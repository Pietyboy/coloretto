import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { Input as AntInput } from 'antd';

import {
  type InputAppearance,
  InputRoot,
  PasswordInput,
  SearchInput,
  TextAreaInput,
} from './input.styled';

export type InputStyleProps = {
  appearance?: InputAppearance;
  fullWidth?: boolean;
  width?: number | string;
};

export type InputProps = ComponentPropsWithoutRef<typeof AntInput> & InputStyleProps;
type InputRef = ElementRef<typeof AntInput>;

const BaseInput = forwardRef<InputRef, InputProps>(({ appearance = 'solid', fullWidth = true, width, ...rest }, ref) => (
  <InputRoot ref={ref} $appearance={appearance} $fullWidth={fullWidth} $width={width} {...rest} />
));

BaseInput.displayName = 'Input';

export type PasswordInputProps = ComponentPropsWithoutRef<typeof AntInput.Password> & InputStyleProps;
type PasswordInputRef = ElementRef<typeof AntInput.Password>;

const BasePasswordInput = forwardRef<PasswordInputRef, PasswordInputProps>(
  ({ appearance = 'solid', fullWidth = true, width, ...rest }, ref) => (
    <PasswordInput ref={ref} $appearance={appearance} $fullWidth={fullWidth} $width={width} {...rest} />
  )
);

BasePasswordInput.displayName = 'Input.Password';

export type SearchInputProps = ComponentPropsWithoutRef<typeof AntInput.Search> & InputStyleProps;
type SearchInputRef = ElementRef<typeof AntInput.Search>;

const BaseSearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  ({ appearance = 'solid', fullWidth = true, width, ...rest }, ref) => (
    <SearchInput ref={ref} $appearance={appearance} $fullWidth={fullWidth} $width={width} {...rest} />
  )
);

BaseSearchInput.displayName = 'Input.Search';

export type TextAreaInputProps = ComponentPropsWithoutRef<typeof AntInput.TextArea> & InputStyleProps;
type TextAreaInputRef = ElementRef<typeof AntInput.TextArea>;

const BaseTextAreaInput = forwardRef<TextAreaInputRef, TextAreaInputProps>(
  ({ appearance = 'solid', fullWidth = true, width, ...rest }, ref) => (
    <TextAreaInput ref={ref} $appearance={appearance} $fullWidth={fullWidth} $width={width} {...rest} />
  )
);

BaseTextAreaInput.displayName = 'Input.TextArea';

export const Input = Object.assign(BaseInput, {
  Group: AntInput.Group,
  Password: BasePasswordInput,
  Search: BaseSearchInput,
  TextArea: BaseTextAreaInput,
});

export type { InputAppearance } from './input.styled';
