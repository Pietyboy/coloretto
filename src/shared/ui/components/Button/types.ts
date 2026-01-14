import { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'accent' | 'danger' | 'ghost' | 'outline' | 'outlineSecondary' | 'primary' | 'secondary';
export type ButtonSize = 'lg' | 'md' | 'sm';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
}
