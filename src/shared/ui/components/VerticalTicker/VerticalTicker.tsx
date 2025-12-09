import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { Transition } from 'motion/react';
import { motion } from 'motion/react';

import { TickerContainer, TickerTrack } from './vertical-ticker.styled';

export type VerticalTickerDirection = 'down' | 'up';

export type VerticalTickerProps = {
  direction?: VerticalTickerDirection;
  height: number | string;
  items: ReactNode | ReactNode[];
  maxWidth?: number | string;
  speed?: number;
  width: number | string;
};

const toCssSize = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);
const MotionTrack = motion(TickerTrack);

export const VerticalTicker = ({
  direction = 'up',
  height,
  items,
  maxWidth = '50vw',
  speed = 1,
  width,
}: VerticalTickerProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackHeight, setTrackHeight] = useState(0);

  useEffect(() => {
    const node = trackRef.current;

    if (!node) return;

    const updateHeight = () => {
      setTrackHeight(node.scrollHeight);
    };

    updateHeight();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateHeight);
      observer.observe(node);

      return () => observer.disconnect();
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }

    return undefined;
  }, [items]);

  const { end, start } = useMemo(() => {
    const offset = trackHeight / 2;
    if (direction === 'down') {
      return { end: 0, start: -offset };
    }
    return { end: -offset, start: 0 };
  }, [direction, trackHeight]);

  const animate = trackHeight === 0 ? { y: 0 } : { y: [start, end] };
  const transition = useMemo<Transition>(
    () => ({
      duration: Math.max(speed, 0.1),
      ease: 'linear' as Transition['ease'],
      repeat: Infinity,
    }),
    [speed]
  );

  return (
    <TickerContainer
      $height={toCssSize(height)}
      $maxWidth={toCssSize(maxWidth)}
      $width={toCssSize(width)}
    >
      <MotionTrack animate={animate} ref={trackRef} transition={transition}>
        {items}
      </MotionTrack>
    </TickerContainer>
  );
};
