import styled, { createGlobalStyle } from 'styled-components';

export const SelectWrapper = styled.div`
  .ant-select-selector {
    background: ${({ theme }) => theme.components?.select?.control.background ?? theme.colors.surface} !important;
    color: ${({ theme }) => theme.components?.select?.control.color ?? theme.colors.textSecondary} !important;
    border-color: ${({ theme }) =>
      theme.components?.select?.control.borderColor ?? theme.colors.surfaceMuted};
  }

  .ant-select-selection-placeholder {
    color: ${({ theme }) => theme.components?.select?.placeholderColor ?? theme.colors.textSecondary} !important;
  }

  .ant-select-selection-item {
    color: ${({ theme }) => theme.components?.select?.control.color ?? theme.colors.textSecondary} !important;
  }

  .ant-select-arrow {
    color: ${({ theme }) => theme.components?.select?.arrowColor ?? theme.colors.textSecondary};
  }
`;

// Дропдаун рендерится в body, поэтому стилизуем глобально
export const SelectDropdownStyles = createGlobalStyle`
  .ant-select-dropdown {
    background: ${({ theme }) => theme.components?.select?.dropdown.background ?? theme.colors.surface} !important;
    color: ${({ theme }) => theme.components?.select?.dropdown.color ?? theme.colors.textSecondary};
    border: 1px solid ${({ theme }) =>
      theme.components?.select?.dropdown.borderColor ?? theme.colors.surfaceMuted};
  }

  .ant-select-item {
    color: ${({ theme }) => theme.components?.select?.option.color ?? theme.colors.textSecondary};

    &-option-selected,
    &-option-active {
      background: ${({ theme }) =>
        theme.components?.select?.option.selectedBackground ?? theme.colors.surfaceMuted} !important;
      color: ${({ theme }) => theme.components?.select?.option.color ?? theme.colors.textSecondary} !important;
    }

    &-option-active {
      background: ${({ theme }) =>
        theme.components?.select?.option.activeBackground ?? theme.colors.surfaceMuted} !important;
    }
  }
`;
