import { useEffect, useMemo, useRef, useState } from 'react';

import { Flex, Typography } from '../../shared/ui/components';

import { gugiFontStyle } from './constants';
import { clampDuration, formatTime, getRemainingSeconds, parseStartAt } from './helpers';

const { Text } = Typography;

export type TimerProps = {
  duration: number;
  onComplete?: () => void;
  paused?: boolean;
  startAt?: null | number | string;
};

export const Timer = ({ duration, onComplete, paused = false, startAt }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(() => clampDuration(duration));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackStartRef = useRef<null | number>(null);
  const lastStartRef = useRef<null | number>(null);
  const pauseOffsetRef = useRef(0);
  const pausedAtRef = useRef<null | number>(null);
  const lastRemainingRef = useRef(clampDuration(duration));

  const startAtMs = useMemo(() => parseStartAt(startAt), [startAt]);

  useEffect(() => {
    if (startAtMs === null) {
      fallbackStartRef.current = Date.now();
    }

    const startKey = startAtMs ?? fallbackStartRef.current;
    const hasNewStart = startKey !== null && startKey !== lastStartRef.current;

    if (hasNewStart) {
      lastStartRef.current = startKey;
      pauseOffsetRef.current = 0;
      pausedAtRef.current = null;
    }

    if (startKey !== null) {
      const nextRemaining = getRemainingSeconds(duration, startKey, pauseOffsetRef.current);
      lastRemainingRef.current = nextRemaining;
      setTimeLeft(nextRemaining);
      return;
    }

    const nextRemaining = clampDuration(duration);
    lastRemainingRef.current = nextRemaining;
    setTimeLeft(nextRemaining);
  }, [duration, startAtMs]);

  useEffect(() => {
    if (!paused) {
      if (pausedAtRef.current !== null) {
        pauseOffsetRef.current += Date.now() - pausedAtRef.current;
        pausedAtRef.current = null;
      }
      return;
    }

    if (pausedAtRef.current === null) {
      pausedAtRef.current = Date.now();
    }
  }, [paused]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (paused) return undefined;

    const startKey = startAtMs ?? fallbackStartRef.current;
    if (startKey === null) return undefined;

    const tick = () => {
      const remaining = getRemainingSeconds(duration, startKey, pauseOffsetRef.current);
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
  }, [duration, onComplete, paused, startAtMs]);

  const formatted = useMemo(() => formatTime(timeLeft), [timeLeft]);

  return (
    <Flex align="center" direction="column" gap={1}>
      <Text style={gugiFontStyle} tone="secondary" size="medium">
        {formatted}
      </Text>
    </Flex>
  );
};
