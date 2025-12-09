import { useEffect, useMemo, useState } from "react";

import { Flex, VerticalTicker } from "../../shared/ui/components";
import { GameCard } from "../game-card";

const CARD_WIDTH = 139;
const GAP = 10;
const HALF_SCREEN_RATIO = 0.5;

const buildTickerItems = () => ([
  <GameCard animation="none" key='backCard' variant="backCard"/>,
  <GameCard animation="none" key='blueCard' variant="blueCard"/>,
  <GameCard animation="none" key='brownCard' variant="brownCard"/>,
  <GameCard animation="none" key='greenCard' variant="greenCard"/>,
  <GameCard animation="none" key='jokerCard' variant="jokerCard"/>,
  <GameCard animation="none" key='orangeCard' variant="orangeCard"/>,
  <GameCard animation="none" key='plusTwoCard' variant="plusTwoCard"/>,
  <GameCard animation="none" key='purpleCard' variant="purpleCard"/>,
  <GameCard animation="none" key='redCard' variant="redCard"/>,
  <GameCard animation="none" key='yellowCard' variant="yellowCard"/>,
]);

const computeTickerCount = () => {
  if (typeof window === 'undefined') {
    return 3;
  }
  const availableWidth = window.innerWidth * HALF_SCREEN_RATIO;
  return Math.max(1, Math.floor(availableWidth / (CARD_WIDTH + GAP)));
};

export const VerticalTickers = () => {
  const items = useMemo(() => buildTickerItems(), []);
  const duplicatedItems = useMemo(() => [...items, ...items], [items]);
  const [tickerCount, setTickerCount] = useState<number>(computeTickerCount());

  useEffect(() => {
    const updateCount = () => setTickerCount(computeTickerCount());
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  return (
    <Flex direction="row" gap={GAP} height='100vh'>
      {Array.from({ length: tickerCount }).map((_, index) => {
        const direction = index % 2 === 0 ? 'up' : 'down';
        return (
          <VerticalTicker
            key={index}
            direction={direction}
            height='100%'
            items={duplicatedItems}
            maxWidth={`${CARD_WIDTH}px`}
            speed={20}
            width={CARD_WIDTH}
          />
        );
      })}
    </Flex>
  );
}
