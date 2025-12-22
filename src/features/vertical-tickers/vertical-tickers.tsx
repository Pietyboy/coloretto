import { useEffect, useMemo, useState } from 'react';

import { Flex, VerticalTicker } from '../../shared/ui/components';
import { GameCard } from '../game-card';

import { CARD_WIDTH, GAP } from './constants';
import { computeTickerCount } from './helpers';

const CARD_VARIANTS = [
  'backCard',
  'blueCard',
  'brownCard',
  'greenCard',
  'jokerCard',
  'orangeCard',
  'plusTwoCard',
  'purpleCard',
  'redCard',
  'yellowCard',
];

const buildTickerItems = () => {
  const variants = [...CARD_VARIANTS, ...CARD_VARIANTS];
  return variants.map((variant, index) => (
    <GameCard animation="none" key={`${variant}-${index}`} variant={variant} />
  ));
};

export const VerticalTickers = () => {
  const items = useMemo(buildTickerItems, []);
  const [tickerCount, setTickerCount] = useState<number>(computeTickerCount());

  useEffect(() => {
    const updateCount = () => setTickerCount(computeTickerCount());
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  return (
    <Flex direction="row" gap={GAP} height="100vh">
      {Array.from({ length: tickerCount }).map((_, index) => {
        const direction = index % 2 === 0 ? 'up' : 'down';
        return (
          <VerticalTicker
            key={`ticker-${index}`}
            direction={direction}
            height="100%"
            items={items}
            maxWidth={`${CARD_WIDTH}px`}
            speed={20}
            width={CARD_WIDTH}
          />
        );
      })}
    </Flex>
  );
};
