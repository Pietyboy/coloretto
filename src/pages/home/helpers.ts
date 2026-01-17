import type { TGameApi } from '../../store/api/types';

import type { StatusFilter } from './types';

export const getStatus = (game: TGameApi): StatusFilter => {
  const statusCandidate = game.status ?? game.gameStatus ?? game.game_status;
  if (typeof statusCandidate === 'string') {
    const normalized = statusCandidate.toLowerCase();
    if (normalized.includes('finish')) return 'finished';
    if (normalized.includes('wait') || normalized.includes('wating')) return 'active';
    if (normalized.includes('pause')) return 'active';
    if (
      normalized.includes('active') ||
      normalized.includes('progress') ||
      normalized.includes('in_progress') ||
      normalized.includes('inprogress')
    ) {
      return 'active';
    }
  }

  if (game.isFinished) return 'finished';
  return 'active';
};
