import type { MotionProps, MotionStyle } from 'motion/react';

export type MotionPresetName = 'default' | 'fade-in' | 'fade-out' | 'none' | 'parallax' | 'tilt';

export type MotionPresetLevel = 'medium' | 'soft' | 'strong';

export type MotionPresetConfig = {
  animate?: MotionProps['animate'];
  exit?: MotionProps['exit'];
  initial?: MotionProps['initial'];
  style?: MotionStyle;
  transition?: MotionProps['transition'];
  whileHover?: MotionProps['whileHover'];
  parallax?: {
    enabled: boolean;
    rotation: number;
  };
};

export type MotionPresetOptions = {
  hoverShadow?: string;
  level: MotionPresetLevel;
  preset: MotionPresetName;
  rotation: number;
};

export type MotionPresetProps = {
  animation?: MotionPresetName;
  animationHoverShadow?: string;
  animationLevel?: MotionPresetLevel;
  animationRotation?: number;
};
