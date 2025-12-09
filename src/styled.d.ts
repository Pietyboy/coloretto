import 'styled-components';

import type { ColorettoTheme } from './shared/ui/themes/types';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ColorettoTheme {}
}
