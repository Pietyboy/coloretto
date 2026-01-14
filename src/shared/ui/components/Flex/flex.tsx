import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { FlexRoot } from './flex.styled';

type FlexRootProps = ComponentPropsWithoutRef<typeof FlexRoot>;

export type FlexProps = Omit<
  FlexRootProps,
  '$fullHeight' | '$fullWidth' | '$padding' | '$paddingX' | '$paddingY'
> & {
  fullHeight?: boolean;
  fullWidth?: boolean;
  padding?: number;
  paddingX?: number;
  paddingY?: number;
};

export const Flex = forwardRef<ElementRef<typeof FlexRoot>, FlexProps>(
  ({ fullHeight, fullWidth, padding, paddingX, paddingY, ...rest }, ref) => (
    <FlexRoot
      ref={ref}
      $fullHeight={fullHeight}
      $fullWidth={fullWidth}
      $padding={padding}
      $paddingX={paddingX}
      $paddingY={paddingY}
      {...rest}
    />
  )
);

Flex.displayName = 'Flex';
