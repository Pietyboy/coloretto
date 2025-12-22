import { useEffect, useMemo, useRef, useState } from 'react';

import { Flex, Typography } from '../../shared/ui/components';

import { gugiFontStyle } from './constants';
import { clampDuration, formatTime } from './helpers';

const { Text } = Typography;

export type TimerProps = {
  duration: number;
  onComplete?: () => void;
  paused?: boolean;
};

export const Timer = ({ duration, onComplete, paused = false }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(() => clampDuration(duration));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(clampDuration(duration));
  }, [duration]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (paused) return undefined;
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
  }, [onComplete, paused, timeLeft]);

  const formatted = useMemo(() => formatTime(timeLeft), [timeLeft]);

  return (
    <Flex align="center" direction="column" gap={1}>
      <Text style={gugiFontStyle} tone="secondary" size="medium">
        {formatted}
      </Text>
    </Flex>
  );
};
