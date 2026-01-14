export const clampDuration = (value: number) => Math.max(0, Math.floor(value));

export const parseStartAt = (value?: null | number | string) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

export const getRemainingSeconds = (duration: number, startAtMs: number, pauseOffsetMs = 0) => {
  if (!Number.isFinite(duration) || duration <= 0) {
    return 0;
  }

  const elapsedMs = Math.max(0, Date.now() - startAtMs - pauseOffsetMs);
  const remaining = Math.ceil(duration - elapsedMs / 1000);

  return clampDuration(remaining);
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(1, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
};
