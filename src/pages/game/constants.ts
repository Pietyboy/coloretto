import type { CSSProperties } from 'react';

export const GAME_PAGE_TOP_ROW_HEIGHT = 180;
export const GAME_PAGE_TOP_ROW_MIN_HEIGHT = 150;

export const GAME_PAGE_GRID_STYLE: CSSProperties = {
  display: 'grid',
  flex: 1,
  gridTemplateColumns: 'minmax(0, 1fr)',
  gridTemplateRows: `clamp(${GAME_PAGE_TOP_ROW_MIN_HEIGHT}px, 20vh, ${GAME_PAGE_TOP_ROW_HEIGHT}px) auto 1fr`,
  minHeight: 0,
  rowGap: 'clamp(8px, 2vh, 24px)',
};
