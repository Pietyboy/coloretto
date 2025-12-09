import styled, { css } from 'styled-components';

import { ButtonSizeStyles, ButtonVariantStyles } from './constants';
import type { ButtonSize, ButtonVariant } from './types';

export type ButtonStyleProps = {
  height?: number;
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth?: boolean;
  fullHeight?: boolean;
  width?: number;
  buttonRadii: ButtonSize
}

export const StyledButton = styled.button<ButtonStyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ buttonRadii = 'md', theme }) => theme.radii[buttonRadii]};
  cursor: pointer;
  gap: ${({ theme }) => theme.spacing(2)};
  transition: transform ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base},
    background ${({ theme }) => theme.transitions.base},
    color ${({ theme }) => theme.transitions.base};
  ${() => css`
    &:disabled {
      cursor: not-allowed;
      opacity: 0.56;
      transform: none;
      box-shadow: none;
    }
  `}

  ${({ variant }) => ButtonVariantStyles[variant]}
  ${({ size }) => ButtonSizeStyles[size]}
  height: ${({ fullHeight, height }) => (fullHeight ? '100%' : height ? `${height}px` : 'auto')};
  width: ${({ fullWidth, width}) => (fullWidth ? '100%' : width ? `${width}px` : 'auto')};
`;
