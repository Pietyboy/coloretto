import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { Select as AntSelect } from 'antd';

import { SelectDropdownStyles, SelectWrapper } from './select.styled';

export type SelectProps = ComponentPropsWithoutRef<typeof AntSelect>;
type SelectRef = ElementRef<typeof AntSelect>;

const BaseSelect = forwardRef<SelectRef, SelectProps>((props, ref) => {
  const { dropdownStyle, getPopupContainer, ...rest } = props;

  return (
    <SelectWrapper>
      <SelectDropdownStyles />
      <AntSelect
        ref={ref}
        dropdownStyle={{ background: '#222222', color: '#F5F5F5', ...dropdownStyle }}
        getPopupContainer={getPopupContainer ?? (trigger => trigger?.parentElement || document.body)}
        {...rest}
      />
    </SelectWrapper>
  );
});

BaseSelect.displayName = 'Select';

export const Select = Object.assign(BaseSelect, {
  OptGroup: AntSelect.OptGroup,
  Option: AntSelect.Option,
});
