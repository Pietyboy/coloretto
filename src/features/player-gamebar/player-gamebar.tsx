import { useState } from 'react';

import { Components } from '../../shared';
import { TGameStatus } from '../../widgets/game-host-controls/types';
import { HandCardIndicator } from '../hand-card-indicator';
import { Timer } from '../timer';

import { getHandCardIndicator } from './helpers';
import { RuleSidebar } from './rule-sidebar/rule-sidebar';
import type { TCard } from './types';

const { Button, Card, Flex, Image } = Components;

type TPlayerGameBarProps = {
  cards: TCard[];
  gameId: number;
  gameStatus: TGameStatus;
  isCurrentTurn?: boolean;
  isPaused?: boolean;
  serverNow?: null | number;
  turnEndsAt?: null | number;
  turnDuration?: number;
  turnStartTime?: null | string;
};

export const PlayerGameBar = (props: TPlayerGameBarProps) => {
  const [isRuleSidebarOpen, setRuleSidebarOpen] = useState(false);
  const {
    cards = [],
    gameId: _gameId,
    gameStatus: _gameStatus,
    isCurrentTurn = false,
    isPaused = false,
    serverNow,
    turnDuration = 40,
    turnEndsAt,
    turnStartTime,
  } = props;

  return (
    <Flex fullWidth gap={5}>
      <Flex align='center' direction='row' fullWidth justify='space-between'>
          <Card animation="none" height={65} padding="sm" width={80}>
          <Flex align="center" fullWidth fullHeight justify="center">
            {isCurrentTurn ? (
              <Timer
                duration={turnDuration}
                paused={isPaused}
                startAt={turnStartTime}
                endAt={turnEndsAt}
                serverNow={serverNow}
              />
            ) : (
              <Image variant="lockIcon" width={25} />
            )}
          </Flex>
        </Card>
      </Flex>
      <Flex align="center" direction="row" gap={5} fullWidth>
        <Card animation="none" fullWidth height={63}>
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
