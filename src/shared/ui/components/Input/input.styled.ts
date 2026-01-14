import { Input as AntInput } from 'antd';
import styled, { css } from 'styled-components';
import type { DefaultTheme } from 'styled-components';

export type InputAppearance = 'ghost' | 'ghostDark' | 'solid';

export type StyledInputProps = {
  $appearance?: InputAppearance;
  $fullWidth?: boolean;
  $width?: number | string;
};

const resolveAppearanceTokens = (theme: DefaultTheme, appearance: InputAppearance) =>
  theme.components?.input?.appearances?.[appearance];

const appearanceStyles: Record<InputAppearance, ReturnType<typeof css>> = {
  ghost: css`
    background: ${({ theme }) =>
      resolveAppearanceTokens(theme, 'ghost')?.background ?? 'transparent'};
    border-color: ${({ theme }) =>
      resolveAppearanceTokens(theme, 'ghost')?.borderColor ?? theme.colors.surfaceMuted};
    color: ${({ theme }) =>
      resolveAppearanceTokens(theme, 'ghost')?.color ?? theme.colors.textPrimary};
  `,
  ghostDark: css`
    background: ${({ theme }) =>
      resolveAppearanceTokens(theme, 'ghostDark')?.background ?? 'transparent'};
    border-color: ${({ theme }) =>
      resolveAppearanceTokens(theme, 'ghostDark')?.borderColor ?? theme.colors.surfaceMuted};
    color: ${({ theme }) =>
      resolveAppearanceTokens(theme, 'ghostDark')?.color ?? theme.colors.textSecondary};
  `,
  solid: css`
    background: ${({ theme }) =>
      resolveAppearanceTokens(theme, 'solid')?.background ?? theme.colors.background};
    border-color: ${({ theme }) =>
      resolveAppearanceTokens(theme, 'solid')?.borderColor ?? theme.colors.surfaceMuted};
    color: ${({ theme }) =>
      resolveAppearanceTokens(theme, 'solid')?.color ?? theme.colors.textPrimary};
  `,
};

const baseInputStyles = css<StyledInputProps>`
  && {
    width: ${({ $fullWidth, $width }) => {
      if ($fullWidth) return '100%';
      if (typeof $width === 'number') return `${$width}px`;
      if (typeof $width === 'string') return $width;
      return '100%';
    }};
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px solid ${({ theme }) => theme.colors.surfaceMuted};
    padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
    transition: border ${({ theme }) => theme.transitions.base}, box-shadow ${({ theme }) => theme.transitions.base};

    ${({ $appearance = 'ghost' }) => appearanceStyles[$appearance]}

    &.ant-input-status-error,
    &.ant-input-affix-wrapper-status-error {
      background: ${({ theme }) => theme.components?.input?.errorBackground ?? 'transparent'};
    }

    &.ant-input-status-error input,
    &.ant-input-affix-wrapper-status-error input {
      background: ${({ theme }) => theme.components?.input?.errorBackground ?? 'transparent'};
    }

    &:hover,
    &:focus-within,
    &.ant-input-affix-wrapper-focused,
    &.ant-input-focused {
      background: ${({ $appearance = 'ghost', theme }) =>
        resolveAppearanceTokens(theme, $appearance)?.background ??
        ($appearance === 'solid' ? theme.colors.background : 'transparent')};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.components?.input?.focusShadowColor ?? theme.colors.accent};
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
