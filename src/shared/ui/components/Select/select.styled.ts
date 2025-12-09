import styled, { createGlobalStyle } from 'styled-components';

export const SelectWrapper = styled.div`
  .ant-select-selector {
    background: #222222 !important;
    color: #F5F5F5 !important;
    border-color: ${({ theme }) => theme.colors.surfaceMuted};
  }

  .ant-select-selection-placeholder,
  .ant-select-selection-item {
    color: #F5F5F5 !important;
  }

  .ant-select-arrow {
    color: #F5F5F5;
  }
`;

// Дропдаун рендерится в body, поэтому стилизуем глобально
export const SelectDropdownStyles = createGlobalStyle`
  .ant-select-dropdown {
    background: #222222 !important;
    color: #F5F5F5;
    border: 1px solid #424041;
  }

  .ant-select-item {
    color: #F5F5F5;

    &-option-selected,
    &-option-active {
      background: #424041 !important;
      color: #F5F5F5 !important;
    }
  }
`;
