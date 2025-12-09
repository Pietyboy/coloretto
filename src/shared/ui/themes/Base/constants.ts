import type { CardColorName, ColorScale } from '../types';

export const neutralScale: ColorScale = {
  50: '#F5F5F5',
  100: '#F5F5F5',
  200: '#424041',
  300: '#424041',
  400: '#424041',
  500: '#424041',
  600: '#424041',
  700: '#222222',
  800: '#222222',
  900: '#222222',
};

export const cardColors: Record<CardColorName, string> = {
  blue: '#6098B5',
  brown: '#795034',
  gray: '#424041',
  green: '#2E9550',
  joker: '#FBD127',
  red: '#D41F28',
  violet: '#814492',
  yellow: '#FBD127',
};
