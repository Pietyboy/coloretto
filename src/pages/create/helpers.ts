import type { TGameApi } from '../../store/api/types';

import type { StatusFilter } from './types';

export const getStatus = (game: TGameApi): StatusFilter => {
  if (game.isFinished) return 'finished';
  if (game.currentPlayersCount < game.maxPlayerCount) return 'waiting';
  return 'in-progress';
};

