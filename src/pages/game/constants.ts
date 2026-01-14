import type { CSSProperties } from 'react';

export const GAME_PAGE_TOP_ROW_HEIGHT = 180;

export const GAME_PAGE_GRID_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `100%`,
  gridTemplateRows: `${GAME_PAGE_TOP_ROW_HEIGHT}px auto 1fr`,
};
