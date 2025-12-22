import type { TGameScoreRow } from './types';

export const normalizeGameScores = (scores: unknown): TGameScoreRow[] => {
  if (!scores) return [];

  const list: unknown[] = Array.isArray(scores)
    ? scores
    : (typeof scores === 'object'
        && Array.isArray((scores as Record<string, unknown>).scores)
        && (scores as Record<string, unknown>).scores as unknown[])
      || (typeof scores === 'object'
        && Array.isArray((scores as Record<string, unknown>).players)
        && (scores as Record<string, unknown>).players as unknown[])
      || [];

  return list
    .map(item => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;

      const playerIdCandidate = record.playerId ?? record.player_id ?? record.id;
      const playerIdRaw = Number(playerIdCandidate);
      const playerId = Number.isFinite(playerIdRaw) ? playerIdRaw : null;

      const nicknameCandidate = record.nickname ?? record.playerName ?? record.player_name ?? record.name;
      const nickname =
        typeof nicknameCandidate === 'string' && nicknameCandidate.trim()
          ? nicknameCandidate.trim()
          : playerId
            ? `Игрок ${playerId}`
            : 'Игрок';

      const scoreCandidate = record.score ?? record.points ?? record.total ?? record.total_score ?? record.sum;
      const scoreRaw = Number(scoreCandidate);
      const score = Number.isFinite(scoreRaw) ? scoreRaw : 0;

      return { nickname, playerId, score };
    })
    .filter((row): row is TGameScoreRow => Boolean(row))
    .sort((a, b) => b.score - a.score);
};

