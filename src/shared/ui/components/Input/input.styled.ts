import { Input as AntInput } from 'antd';
import styled, { css } from 'styled-components';

export type InputAppearance = 'ghost' | 'ghostDark' | 'solid';

export type StyledInputProps = {
  appearance?: InputAppearance;
  fullWidth?: boolean;
  width?: number | string;
};

const appearanceStyles: Record<InputAppearance, ReturnType<typeof css>> = {
  ghost: css`
    background: transparent;
    border-color: ${({ theme }) => theme.colors.surfaceMuted};
    color: ${({ theme }) => theme.colors.textPrimary};
  `,
  ghostDark: css`
    background: transparent;
    border-color: ${({ theme }) => theme.colors.surfaceMuted};
    color: ${({ theme }) => theme.colors.textSecondary};
  `,
  solid: css`
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
  `,
};

const baseInputStyles = css<StyledInputProps>`
  && {
    width: ${({ fullWidth, width }) => {
      if (fullWidth) return '100%';
      if (typeof width === 'number') return `${width}px`;
      if (typeof width === 'string') return width;
      return '100%';
    }};
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px solid ${({ theme }) => theme.colors.surfaceMuted};
    padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
    transition: border ${({ theme }) => theme.transitions.base}, box-shadow ${({ theme }) => theme.transitions.base};

    ${({ appearance = 'ghost' }) => appearanceStyles[appearance]}

    &.ant-input-status-error,
    &.ant-input-affix-wrapper-status-error {
      background: transparent;
    }

    &.ant-input-status-error input,
    &.ant-input-affix-wrapper-status-error input {
      background: transparent;
    }

    &:hover,
    &:focus-within,
    &.ant-input-affix-wrapper-focused,
    &.ant-input-focused {
      background: ${({ appearance = 'ghost', theme }) =>
        appearance === 'solid' ? theme.colors.background : 'transparent'};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent};
    }
  }
`;

export const InputRoot = styled(AntInput)<StyledInputProps>`
  ${baseInputStyles}
`;

export const PasswordInput = styled(AntInput.Password)<StyledInputProps>`
  ${baseInputStyles}
`;

export const SearchInput = styled(AntInput.Search)<StyledInputProps>`
  ${baseInputStyles}
`;

export const TextAreaInput = styled(AntInput.TextArea)<StyledInputProps>`
  ${baseInputStyles}
`;
