import type { ComponentType, MouseEvent } from 'react';
import { forwardRef, useCallback } from 'react';

import type { MotionStyle } from 'motion/react';
import { motion, useSpring } from 'motion/react';

import { getMotionPreset } from './presets';
import type { MotionPresetProps } from './types';

type AnyProps = {
  onMouseLeave?: (event: MouseEvent<Element>) => void;
  onMouseMove?: (event: MouseEvent<Element>) => void;
  style?: MotionStyle;
};

export const withMotionPreset = <P extends object>(BaseComponent: ComponentType<P>) => {
  const MotionComponent = motion(BaseComponent);

  const WithPreset = forwardRef<any, P & MotionPresetProps>((props, ref) => {
    const {
      animation = 'default',
      animationHoverShadow,
      animationLevel = 'medium',
      animationRotation = 6,
      ...rest
    } = props;

    const preset = getMotionPreset({
      hoverShadow: animationHoverShadow,
      level: animationLevel,
      preset: animation,
      rotation: animationRotation,
    });

    const rotateX = useSpring(0, { damping: 20, stiffness: 200 });
    const rotateY = useSpring(0, { damping: 20, stiffness: 200 });

    const parallaxEnabled = preset.parallax?.enabled ?? false;
    const parallaxRotation = preset.parallax?.rotation ?? animationRotation;

    const handleMouseMove = useCallback(
      (event: MouseEvent<Element>) => {
        if (!parallaxEnabled) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const mouseX = event.clientX - rect.left - rect.width / 2;
        const mouseY = event.clientY - rect.top - rect.height / 2;

        rotateX.set((mouseY / rect.height) * parallaxRotation);
        rotateY.set((-mouseX / rect.width) * parallaxRotation);
      },
      [parallaxEnabled, parallaxRotation, rotateX, rotateY]
    );

    const handleMouseLeave = useCallback(() => {
      if (!parallaxEnabled) return;
      rotateX.set(0);
      rotateY.set(0);
    }, [parallaxEnabled, rotateX, rotateY]);

    const { onMouseLeave, onMouseMove, style: incomingStyle, ...componentProps } = rest as P & AnyProps;

    const motionStyle: MotionStyle | undefined = parallaxEnabled
      ? {
          ...preset.style,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d' as MotionStyle['transformStyle'],
        }
      : preset.style;

    const mergedStyle = motionStyle && incomingStyle ? { ...motionStyle, ...incomingStyle } : motionStyle ?? incomingStyle;

    const composedMouseMove = parallaxEnabled
      ? (event: MouseEvent<Element>) => {
          handleMouseMove(event);
          onMouseMove?.(event);
        }
      : onMouseMove;

    const composedMouseLeave = parallaxEnabled
      ? (event: MouseEvent<Element>) => {
          handleMouseLeave();
          onMouseLeave?.(event);
        }
      : onMouseLeave;

    return (
      <MotionComponent
        ref={ref}
        {...(componentProps as any)}
        style={mergedStyle}
        transition={preset.transition}
        whileHover={preset.whileHover}
        onMouseMove={composedMouseMove}
        onMouseLeave={composedMouseLeave}
      />
    );
  });

  WithPreset.displayName = `withMotionPreset(${BaseComponent.displayName ?? BaseComponent.name ?? 'Component'})`;

  return WithPreset;
};
