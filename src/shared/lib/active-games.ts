export type ActiveGame = {
  gameId: number;
  gameName: string;
};

type ActiveGameRecord = ActiveGame & {
  updatedAt: number;
};

const STORAGE_KEY = 'coloretto.activeGames.v1';
export const ACTIVE_GAMES_EVENT = 'coloretto:activeGames';

const safeParseJson = (value: null | string): unknown => {
  if (!value) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch (_err) {
    return null;
  }
};

const normalizeRecord = (record: unknown): ActiveGameRecord | null => {
  if (!record || typeof record !== 'object') return null;
  const candidate = record as Partial<ActiveGameRecord>;

  const gameId = typeof candidate.gameId === 'number' ? candidate.gameId : Number(candidate.gameId);
  if (!Number.isFinite(gameId) || gameId <= 0) return null;

  const gameName =
    typeof candidate.gameName === 'string' && candidate.gameName.trim()
      ? candidate.gameName.trim()
      : `Игра ${gameId}`;

  const updatedAt = typeof candidate.updatedAt === 'number' ? candidate.updatedAt : 0;

  return {
    gameId,
    gameName,
    updatedAt,
  };
};

const emitChange = () => {
  window.dispatchEvent(new Event(ACTIVE_GAMES_EVENT));
};

const getActiveGameRecords = (): ActiveGameRecord[] => {
  const parsed = safeParseJson(sessionStorage.getItem(STORAGE_KEY));
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map(normalizeRecord)
    .filter((v): v is ActiveGameRecord => Boolean(v))
    .sort((a, b) => b.updatedAt - a.updatedAt)
};

export const getActiveGames = (): ActiveGame[] =>
  getActiveGameRecords().map(({ gameId, gameName }) => ({ gameId, gameName }));

const writeActiveGameRecords = (records: ActiveGameRecord[]) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const addActiveGame = (game: ActiveGame) => {
  const nextRecord: ActiveGameRecord = {
    ...game,
    updatedAt: Date.now(),
  };

  const existing = getActiveGameRecords().filter(entry => entry.gameId !== nextRecord.gameId);
  const next = [nextRecord, ...existing].slice(0, 20);

  writeActiveGameRecords(next);
  emitChange();
};

export const removeActiveGame = (gameId: number) => {
  const next = getActiveGameRecords().filter(game => game.gameId !== gameId);
  writeActiveGameRecords(next);
  emitChange();
};

export const clearActiveGames = () => {
  sessionStorage.removeItem(STORAGE_KEY);
  emitChange();
};
