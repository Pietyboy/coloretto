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
  ({ buttonRadii = 'md', children, fullHeight=false, fullWidth = false, size = 'md', variant = 'primary', ...rest }, ref) => (
    <StyledButton buttonRadii={buttonRadii} ref={ref} variant={variant} size={size} fullWidth={fullWidth} fullHeight={fullHeight} {...rest}>
      {children}
    </StyledButton>
  )
);

Button.displayName = 'Button';
