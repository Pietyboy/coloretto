import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { AutoComplete as AntAutoComplete } from 'antd';

export type AutoCompleteProps = ComponentPropsWithoutRef<typeof AntAutoComplete>;
type AutoCompleteRef = ElementRef<typeof AntAutoComplete>;

export const AutoComplete = forwardRef<AutoCompleteRef, AutoCompleteProps>((props, ref) => (
  <AntAutoComplete ref={ref} {...props} />
));

AutoComplete.displayName = 'AutoComplete';
