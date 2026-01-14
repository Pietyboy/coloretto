import type { ColorettoTheme } from '../types';

import { cardColors, neutralScale } from './constants';

const colors: ColorettoTheme['colors'] = {
  accent: '#EB6913',
  background: '#F5F5F5',
  buttonPrimary: '#222222',
  buttonSecondary: '#F5F5F5',
  cardColors,
  danger: '#D41F28',
  neutrals: neutralScale,
  success: '#2E9550',
  surface: '#222222',
  surfaceMuted: '#424041',
  textPrimary: '#222222',
  textSecondary: '#F5F5F5',
  warning: '>',
};

const elevation = [
  { level: 0, shadow: 'none' },
  {
    level: 1,
    shadow: '0 2px 6px rgba(34, 34, 34, 0.3)',
  },
  {
    level: 2,
    shadow: '0 8px 18px rgba(34, 34, 34, 0.4)',
  },
  {
    level: 3,
    shadow: '0 16px 32px rgba(34, 34, 34, 0.5)',
  },
];

const spacing = (factor: number) => `${factor * 4}px`;

const typography = {
  body: {
    large: "400 3rem/0.5 'SF Pro Rounded', 'SF Pro Display', 'Segoe UI', sans-serif",
    medium: "400 1.5rem/0.5 'SF Pro Rounded', 'SF Pro Display', 'Segoe UI', sans-serif",
    regular: "400 1rem/1.5 'SF Pro Rounded', 'SF Pro Display', 'Segoe UI', sans-serif",
    small: "400 0.875rem/1.5 'SF Pro Rounded', 'SF Pro Display', 'Segoe UI', sans-serif",
    tiny: "400 0.75rem/1.5 'SF Pro Rounded', 'SF Pro Display', 'Segoe UI', sans-serif",
  },
  fontFamily: "'SF Pro Rounded', 'SF Pro Display', 'Segoe UI', sans-serif",
  headings: {
    h1: "600 2.5rem/1.1 'SF Pro Rounded', 'SF Pro Display', 'Segoe UI', sans-serif",
    h2: "600 2rem/1.2 'SF Pro Rounded', 'SF Pro Display', 'Segoe UI', sans-serif",
    h3: "600 1.75rem/1.25 'SF Pro Rounded', 'SF Pro Display', 'Segoe UI', sans-serif",
    h4: "600 1.5rem/1.3 'SF Pro Rounded', 'SF Pro Display', 'Segoe UI', sans-serif",
    h5: "600 1.25rem/1.4 'SF Pro Rounded', 'SF Pro Display', 'Segoe UI', sans-serif",
    h6: "600 1.125rem/1.45 'SF Pro Rounded', 'SF Pro Display', 'Segoe UI', sans-serif",
  },
};

const buttonTokens = {
  sizes: {
    lg: {
      font: typography.headings.h6,
      height: '48px',
      paddingX: spacing(4),
    },
    md: {
      font: typography.body.regular,
      height: '40px',
      paddingX: spacing(3),
    },
    sm: {
      font: typography.body.small,
      height: '32px',
      paddingX: spacing(2),
    },
  },
  variants: {
    accent: {
      active: {
        background: colors.accent,
      },
      background: colors.buttonSecondary,
      color: colors.textPrimary,
      hover: {
        background: colors.accent,
        color: colors.textSecondary,
      },
    },
    danger: {
      active: {
        boxShadow: elevation[1].shadow,
        transform: 'translateY(0)',
      },
      background: colors.danger,
      boxShadow: elevation[1].shadow,
      color: colors.textSecondary,
      hover: {
        boxShadow: elevation[2].shadow,
        transform: 'translateY(-1px)',
      },
    },
    ghost: {
      active: {
        background: colors.surface,
      },
      background: 'transparent',
      color: colors.textPrimary,
      hover: {
        background: colors.accent,
        color: colors.textPrimary,
      },
    },
    outline: {
      active: {
        background: colors.surface,
      },
      background: colors.surface,
      borderColor: colors.neutrals[600],
      color: colors.textSecondary,
      hover: {
        background: colors.surfaceMuted,
      },
    },
    outlineSecondary: {
      background: 'transparent',
      color: colors.buttonSecondary,
      hover: {
        opacity: 0.6,
      },
    },
    primary: {
      active: {
        boxShadow: elevation[1].shadow,
        transform: 'translateY(0)',
      },
      background: colors.buttonPrimary,
      boxShadow: elevation[1].shadow,
      color: colors.textSecondary,
      hover: {
        boxShadow: elevation[2].shadow,
        transform: 'translateY(-1px)',
      },
    },
    secondary: {
      active: {
        background: colors.surfaceMuted,
      },
      background: colors.buttonSecondary,
      color: colors.textPrimary,
      hover: {
        background: colors.buttonPrimary,
        color: colors.textSecondary,
      },
    },
  },
};

const cardTokens = {
  variants: {
    glass: {
      backdropFilter: 'blur(10px)',
      background: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    muted: {
      background: colors.surfaceMuted,
      borderColor: 'rgba(255, 255, 255, 0.03)',
    },
    solid: {
      background: colors.surface,
      borderColor: colors.surfaceMuted,
    },
  },
};

const inputTokens = {
  appearances: {
    ghost: {
      background: 'transparent',
      borderColor: colors.surfaceMuted,
      color: colors.textPrimary,
    },
    ghostDark: {
      background: 'transparent',
      borderColor: colors.surfaceMuted,
      color: colors.textSecondary,
    },
    solid: {
      background: colors.background,
      borderColor: colors.surfaceMuted,
      color: colors.textPrimary,
    },
  },
  errorBackground: 'transparent',
  focusShadowColor: colors.accent,
};

const selectTokens = {
  arrowColor: colors.textSecondary,
  control: {
    background: colors.surface,
    borderColor: colors.surfaceMuted,
    color: colors.textSecondary,
  },
  dropdown: {
    background: colors.surface,
    borderColor: colors.surfaceMuted,
    color: colors.textSecondary,
  },
  option: {
    activeBackground: colors.surfaceMuted,
    color: colors.textSecondary,
    selectedBackground: colors.surfaceMuted,
  },
  placeholderColor: colors.textSecondary,
};

const typographyTokens = {
  tones: {
    accent: colors.accent,
    danger: colors.danger,
    default: colors.textPrimary,
    muted: colors.surfaceMuted,
    secondary: colors.textSecondary,
    success: colors.success,
    warning: colors.warning,
  },
};

export const baseTheme: ColorettoTheme = {
  colors,
  components: {
    button: buttonTokens,
    card: cardTokens,
    drawer: {
      background: '#222222',
      borderRadius: '10px',
      colorText: '#F5F5F5',
    },
    input: inputTokens,
    select: selectTokens,
    typography: typographyTokens,
  },
  elevation,
  radii: {
    lg: '16px',
    md: '10px',
    pill: '999px',
    sm: '6px',
  },
  spacing,
  transitions: {
    base: '150ms ease',
    bounce: '200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  typography,
};
