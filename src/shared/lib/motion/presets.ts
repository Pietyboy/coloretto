import type { MotionPresetConfig, MotionPresetLevel, MotionPresetName, MotionPresetOptions } from './types';

const LEVEL_MULTIPLIER: Record<MotionPresetLevel, number> = {
  medium: 1,
  soft: 0.6,
  strong: 1.4,
};

const springTransition = { damping: 18, stiffness: 220, type: 'spring' } as const;

const tiltTransition = { damping: 20, stiffness: 260, type: 'spring' } as const;
const parallaxTransition = { damping: 18, stiffness: 200, type: 'spring' } as const;

const fadeTransition = { duration: 0.18, ease: 'easeOut', type: 'tween' } as const;

const getMultiplier = (level: MotionPresetLevel) => LEVEL_MULTIPLIER[level];

const buildDefaultPreset = (options: MotionPresetOptions): MotionPresetConfig => {
  const step = 4 * getMultiplier(options.level);

  if (options.preset === 'none') {
    return {};
  }

  return {
    transition: springTransition,
    whileHover: {
      boxShadow: options.hoverShadow,
      y: -step,
    },
  };
};

const buildFadeInPreset = (options: MotionPresetOptions): MotionPresetConfig => {
  const step = 4 * getMultiplier(options.level);

  return {
    animate: { opacity: 1 },
    initial: { opacity: 0 },
    transition: fadeTransition,
    whileHover: {
      boxShadow: options.hoverShadow,
      transition: springTransition,
      y: -step,
    },
  };
};

const buildFadeOutPreset = (options: MotionPresetOptions): MotionPresetConfig => {
  const step = 4 * getMultiplier(options.level);

  return {
    exit: { opacity: 0 },
    transition: fadeTransition,
    whileHover: {
      boxShadow: options.hoverShadow,
      transition: springTransition,
      y: -step,
    },
  };
};

const buildTiltPreset = (options: MotionPresetOptions): MotionPresetConfig => {
  const multiplier = getMultiplier(options.level);
  const rotation = options.rotation * multiplier;

  return {
    style: { transformPerspective: '800px' },
    transition: tiltTransition,
    whileHover: {
      boxShadow: options.hoverShadow,
      rotateX: -rotation,
      rotateY: rotation,
      y: -4 * multiplier,
    },
  };
};

const buildParallaxPreset = (options: MotionPresetOptions): MotionPresetConfig => {
  const multiplier = getMultiplier(options.level);

  return {
    parallax: {
      enabled: true,
      rotation: options.rotation * multiplier,
    },
    style: { transformPerspective: '900px' },
    transition: parallaxTransition,
    whileHover: {
      boxShadow: options.hoverShadow,
      y: -4 * multiplier,
    },
  };
};

const PRESET_BUILDERS: Record<MotionPresetName, (options: MotionPresetOptions) => MotionPresetConfig> = {
  default: buildDefaultPreset,
  'fade-in': buildFadeInPreset,
  'fade-out': buildFadeOutPreset,
  none: buildDefaultPreset,
  parallax: buildParallaxPreset,
  tilt: buildTiltPreset,
};

export const getMotionPreset = (options: MotionPresetOptions): MotionPresetConfig => {
  const builder = PRESET_BUILDERS[options.preset] ?? buildDefaultPreset;

  return builder(options);
};
