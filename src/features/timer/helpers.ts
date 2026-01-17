export const clampDuration = (value: number) => Math.max(0, Math.floor(value));

export const parseStartAt = (value?: null | number | string) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const asNumber = Number(trimmed);
    if (Number.isFinite(asNumber)) {
      return asNumber < 1e12 ? asNumber * 1000 : asNumber;
    }

    const parsed = Date.parse(trimmed);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

export const getRemainingSeconds = (duration: number, startAtMs: number, nowMs: number, pauseOffsetMs = 0) => {
  if (!Number.isFinite(duration) || duration <= 0) {
    return 0;
  }

  const elapsedMs = Math.max(0, nowMs - startAtMs - pauseOffsetMs);
  const remaining = Math.ceil(duration - elapsedMs / 1000);

  return clampDuration(remaining);
};

export const getRemainingSecondsUntil = (endAtMs: number, nowMs: number, pauseOffsetMs = 0) => {
  if (!Number.isFinite(endAtMs)) {
    return 0;
  }

  const remainingMs = endAtMs - (nowMs - pauseOffsetMs);
  const remaining = Math.ceil(remainingMs / 1000);
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
