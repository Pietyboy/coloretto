import type { HTMLAttributes, ReactNode } from 'react';

import { useTheme } from 'styled-components';

import { withMotionPreset } from '../../../lib/motion';
import type { ColorettoTheme } from '../../themes/types';

import { CardRoot, CardStyleProps } from './card.styled';
import type { CardAnimation, CardAnimationLevel } from './types';

const AnimatedCardRoot = withMotionPreset(CardRoot);

export type CardProps = CardStyleProps &
  HTMLAttributes<HTMLDivElement> & {
    animation?: CardAnimation;
    animationLevel?: CardAnimationLevel;
    animationRotation?: number;
    children?: ReactNode;
  };

export const Card = ({
  animation = 'default',
  animationLevel = 'medium',
  animationRotation = 6,
  backgroundColor,
  children,
  elevation = 1,
  fullHeight,
  fullWidth,
  height,
  overflow,
  padding,
  variant,
  width,
  ...rest
}: CardProps) => {
  const theme = useTheme() as ColorettoTheme;
  const nextElevationIndex = Math.min(elevation + 1, theme.elevation.length - 1);
  const hoverShadow = theme.elevation[nextElevationIndex]?.shadow ?? theme.elevation[elevation].shadow;

  return (
    <AnimatedCardRoot
      {...rest}
      $backgroundColor={backgroundColor}
      $elevation={elevation}
      $fullHeight={fullHeight}
      $fullWidth={fullWidth}
      $height={height}
      $overflow={overflow}
      $padding={padding}
      $variant={variant}
      $width={width}
      animation={animation}
      animationLevel={animationLevel}
      animationRotation={animationRotation}
      animationHoverShadow={hoverShadow}
    >
      {children}
    </AnimatedCardRoot>
  );
};
