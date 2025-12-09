import type { ColorettoTheme } from '../types';

import { cardColors, neutralScale } from './constants';

export const baseTheme: ColorettoTheme = {
  colors: {
    accent: '#EB6913',
    background: '#F5F5F5',
    buttonPrimary: '#222222',
    buttonSecondary:'#F5F5F5',
    cardColors: cardColors,
    danger: '#D41F28',
    neutrals: neutralScale,
    success: '#2E9550',
    surface: '#222222',
    surfaceMuted: '#424041',
    textPrimary: '#222222',
    textSecondary: '#F5F5F5',
    warning: '#FBD127',
  },
  components: {
    drawer: {
      background: '#222222',
      borderRadius: '10px',
      colorText: '#F5F5F5',
    },
  },
  elevation: [
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
  ],
  radii: {
    lg: '16px',
    md: '10px',
    pill: '999px',
    sm: '6px',
  },
  spacing: (factor) => `${factor * 4}px`,
  transitions: {
    base: '150ms ease',
    bounce: '200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  typography: {
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
  },
};
