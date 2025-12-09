import { useEffect, useMemo, useRef, useState } from 'react';

import { Flex, Typography } from '../../shared/ui/components';

import { gugiFontStyle } from './constants';

const { Text } = Typography;

export type TimerProps = {
  duration: number;
  onComplete?: () => void;
};

const clampDuration = (value: number) => Math.max(0, Math.floor(value));

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(1, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
};

export const Timer = ({ duration, onComplete }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(() => clampDuration(duration));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(clampDuration(duration));
  }, [duration]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (timeLeft <= 0) return undefined;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          intervalRef.current = null;
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeLeft, onComplete]);

  const formatted = useMemo(() => formatTime(timeLeft), [timeLeft]);

  return (
    <Flex align="center" direction="column" gap={1}>
      <Text style={gugiFontStyle} tone="secondary" size="medium">
        {formatted}
      </Text>
    </Flex>
  );
};
