export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export type Elevation = {
  level: number;
  shadow: string;
};

export type CardColorName =
  | 'blue'
  | 'brown'
  | 'gray'
  | 'green'
  | 'joker'
  | 'red'
  | 'violet'
  | 'yellow';

export interface ColorettoTheme {
  colors: {
    background: string;
    buttonPrimary: string;
    buttonSecondary: string;
    surface: string;
    surfaceMuted: string;
    textPrimary: string;
    textSecondary: string;
    success: string;
    warning: string;
    danger: string;
    accent: string;
    neutrals: ColorScale;
    cardColors: Record<CardColorName, string>;
  };
  components?: {
    drawer?: {
      background?: string;
      borderRadius?: string;
      colorText?: string;
    };
  };
  elevation: Elevation[];
  radii: {
    sm: string;
    md: string;
    lg: string;
    pill: string;
  };
  spacing: (factor: number) => string;
  transitions: {
    base: string;
    bounce: string;
  };
  typography: {
    fontFamily: string;
    headings: {
      h1: string;
      h2: string;
      h3: string;
      h4: string;
      h5: string;
      h6: string;
    };
    body: {
      medium: string;
      regular: string;
      small: string;
      tiny: string;
      large: string;
    };
  };
}
