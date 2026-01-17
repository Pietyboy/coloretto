import { useEffect, useMemo, useRef, useState } from 'react';

import { Flex, Typography } from '../../shared/ui/components';

import { gugiFontStyle } from './constants';
import { clampDuration, formatTime, getRemainingSeconds, getRemainingSecondsUntil, parseStartAt } from './helpers';

const { Text } = Typography;

export type TimerProps = {
  duration: number;
  onComplete?: () => void;
  paused?: boolean;
  startAt?: null | number | string;
  endAt?: null | number | string;
  serverNow?: null | number;
};

export const Timer = ({ duration, endAt, onComplete, paused = false, serverNow, startAt }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(() => clampDuration(duration));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackStartRef = useRef<null | number>(null);
  const lastStartRef = useRef<null | number>(null);
  const pauseOffsetRef = useRef(0);
  const pausedAtRef = useRef<null | number>(null);
  const lastRemainingRef = useRef(clampDuration(duration));

  const startAtMs = useMemo(() => parseStartAt(startAt), [startAt]);
  const endAtMs = useMemo(() => parseStartAt(endAt), [endAt]);

  const serverNowRef = useRef<null | number>(null);
  const perfNowRef = useRef<null | number>(null);

  useEffect(() => {
    if (typeof serverNow === 'number' && Number.isFinite(serverNow)) {
      serverNowRef.current = serverNow;
      perfNowRef.current = performance.now();
      return;
    }

    serverNowRef.current = null;
    perfNowRef.current = null;
  }, [serverNow]);

  const getNowMs = () => {
    const serverBase = serverNowRef.current;
    const perfBase = perfNowRef.current;

    if (typeof serverBase === 'number' && typeof perfBase === 'number') {
      return serverBase + (performance.now() - perfBase);
    }

    return Date.now();
  };

  useEffect(() => {
    if (startAtMs === null) {
      fallbackStartRef.current = getNowMs();
    }

    const startKey = startAtMs ?? fallbackStartRef.current;
    const resolvedEndAt = endAtMs ?? (startKey !== null ? startKey + duration * 1000 : null);
    const tickKey = resolvedEndAt ?? startKey;
    const hasNewStart = tickKey !== null && tickKey !== lastStartRef.current;

    if (hasNewStart) {
      lastStartRef.current = tickKey;
      pauseOffsetRef.current = 0;
      pausedAtRef.current = null;
    }

    if (typeof resolvedEndAt === 'number' && Number.isFinite(resolvedEndAt)) {
      const nextRemaining = getRemainingSecondsUntil(resolvedEndAt, getNowMs(), pauseOffsetRef.current);
      lastRemainingRef.current = nextRemaining;
      setTimeLeft(nextRemaining);
      return;
    }

    if (startKey !== null) {
      const nextRemaining = getRemainingSeconds(duration, startKey, getNowMs(), pauseOffsetRef.current);
      lastRemainingRef.current = nextRemaining;
      setTimeLeft(nextRemaining);
      return;
    }

    const nextRemaining = clampDuration(duration);
    lastRemainingRef.current = nextRemaining;
    setTimeLeft(nextRemaining);
  }, [duration, endAtMs, startAtMs]);

  useEffect(() => {
    if (!paused) {
      if (pausedAtRef.current !== null) {
        pauseOffsetRef.current += getNowMs() - pausedAtRef.current;
        pausedAtRef.current = null;
      }
      return;
    }

    if (pausedAtRef.current === null) {
      pausedAtRef.current = getNowMs();
    }
  }, [paused]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (paused) return undefined;

    const startKey = startAtMs ?? fallbackStartRef.current;
    if (startKey === null) return undefined;
    const resolvedEndAt = endAtMs ?? startKey + duration * 1000;

    const tick = () => {
      const remaining =
        typeof resolvedEndAt === 'number' && Number.isFinite(resolvedEndAt)
          ? getRemainingSecondsUntil(resolvedEndAt, getNowMs(), pauseOffsetRef.current)
          : getRemainingSeconds(duration, startKey, getNowMs(), pauseOffsetRef.current);
      const prevRemaining = lastRemainingRef.current;
      lastRemainingRef.current = remaining;
      setTimeLeft(remaining);

      if (remaining <= 0) {
        if (prevRemaining > 0) {
          onComplete?.();
        }
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration, endAtMs, onComplete, paused, startAtMs]);

  const formatted = useMemo(() => formatTime(timeLeft), [timeLeft]);

  return (
    <Flex align="center" direction="column" gap={1}>
      <Text style={gugiFontStyle} tone="secondary" size="medium">
        {formatted}
      </Text>
    </Flex>
  );
};
