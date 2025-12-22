import { ButtonHTMLAttributes, forwardRef } from 'react';

import { StyledButton } from './button.styled';
import { ButtonSize, ButtonVariant } from './types';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonRadii?: ButtonSize;
  fullHeight?: boolean;
  fullWidth?: boolean;
  height?: number;
  size?: ButtonSize;
  variant?: ButtonVariant;
  width?: number;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      buttonRadii = 'md',
      children,
      fullHeight = false,
      fullWidth = false,
      height,
      size = 'md',
      variant = 'primary',
      width,
      ...rest
    },
    ref
  ) => (
    <StyledButton
      $buttonRadii={buttonRadii}
      $fullHeight={fullHeight}
      $fullWidth={fullWidth}
      $height={height}
      $size={size}
      $variant={variant}
      $width={width}
      ref={ref}
      {...rest}
    >
      {children}
    </StyledButton>
  )
);

Button.displayName = 'Button';
