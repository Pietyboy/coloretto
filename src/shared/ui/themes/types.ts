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

export type ComponentStateTokens = {
  background?: string;
  borderColor?: string;
  boxShadow?: string;
  color?: string;
  opacity?: number;
  transform?: string;
};

export type ButtonVariantTokens = ComponentStateTokens & {
  active?: ComponentStateTokens;
  hover?: ComponentStateTokens;
};

export type ButtonSizeTokens = {
  font: string;
  height: string;
  paddingX: string;
};

export type CardVariantTokens = {
  backdropFilter?: string;
  background: string;
  borderColor?: string;
};

export type InputAppearanceTokens = {
  background: string;
  borderColor: string;
  color: string;
};

export type InputTokens = {
  appearances: Record<string, InputAppearanceTokens>;
  errorBackground?: string;
  focusShadowColor: string;
};

export type SelectTokens = {
  arrowColor: string;
  control: {
    background: string;
    borderColor: string;
    color: string;
  };
  dropdown: {
    background: string;
    borderColor: string;
    color: string;
  };
  option: {
    activeBackground: string;
    color: string;
    selectedBackground: string;
  };
  placeholderColor: string;
};

export type TypographyToneTokens = Record<string, string>;

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
    button?: {
      sizes?: Record<string, ButtonSizeTokens>;
      variants?: Record<string, ButtonVariantTokens>;
    };
    card?: {
      variants?: Record<string, CardVariantTokens>;
    };
    input?: InputTokens;
    select?: SelectTokens;
    typography?: {
      tones?: TypographyToneTokens;
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
