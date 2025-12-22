import { useState } from 'react';

import { Components } from '../../shared';
import { HandCardIndicator } from '../hand-card-indicator';
import { Timer } from '../timer';

import { getHandCardIndicator } from './helpers';
import { RuleSidebar } from './rule-sidebar/rule-sidebar';
import type { TCard } from './types';

const { Button, Card, Flex, Image } = Components;

type TPlayerGameBarProps = {
  cards: TCard[];
  isCurrentTurn?: boolean;
  isPaused?: boolean;
  turnDuration?: number;
};

export const PlayerGameBar = (props: TPlayerGameBarProps) => {
  const [isRuleSidebarOpen, setRuleSidebarOpen] = useState(false);
  const { cards = [], isCurrentTurn = false, isPaused = false, turnDuration = 40 } = props;

  return (
    <Flex gap={5}>
      <Card animation="none" height={65} padding="sm" width={80}>
        <Flex align="center" fullWidth fullHeight justify="center">
          {isCurrentTurn ? <Timer duration={turnDuration} paused={isPaused} /> : <Image variant="lockIcon" width={25} />}
        </Flex>
      </Card>
      <Flex align="center" direction="row" gap={5} fullWidth>
        <Card animation="none" fullWidth>
          <Flex direction="row" gap={20} fullWidth justify="center">
            {cards.map((card, index) => (
              <HandCardIndicator
              key={`${card.color}-${card.type}-${index}`}
              count={card.count}
              indicator={getHandCardIndicator(card)}
            />
            ))}
          </Flex>
        </Card>
        <Button variant="primary" height={63} width={63} onClick={() => setRuleSidebarOpen(true)}>
          <Image variant="bookIcon" />
        </Button>

        <RuleSidebar isSidebarOpen={isRuleSidebarOpen} onSidebarClose={setRuleSidebarOpen} />
      </Flex>
    </Flex>
  );
};
