import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { FlexRoot } from './flex.styled';

type FlexRootProps = ComponentPropsWithoutRef<typeof FlexRoot>;

export type FlexProps = Omit<FlexRootProps, '$fullHeight' | '$fullWidth'> & {
  fullHeight?: boolean;
  fullWidth?: boolean;
};

export const Flex = forwardRef<ElementRef<typeof FlexRoot>, FlexProps>(
  ({ fullHeight, fullWidth, ...rest }, ref) => (
    <FlexRoot ref={ref} $fullHeight={fullHeight} $fullWidth={fullWidth} {...rest} />
  )
);

Flex.displayName = 'Flex';
