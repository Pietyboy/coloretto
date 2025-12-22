import { Card, Flex, Image, Typography } from '../../shared/ui/components';
import { HandCardIndicator } from '../hand-card-indicator';
import { getHandCardIndicator } from '../player-gamebar/helpers';
import { Profile } from '../profile';
import { Timer } from '../timer';

import { IndicatorsGrid } from './styles';
import type { TCard } from './types';

type TPlayerGameBarProps = {
  cards: TCard[];
  isCurrentTurn?: boolean;
  isPaused?: boolean;
  playerName?: null | string;
  turnDuration?: number;
};

export const OtherPlayerGameBar = (props: TPlayerGameBarProps) => {
  const { cards = [], isCurrentTurn = false, isPaused = false, playerName, turnDuration = 40 } = props;
  const displayName = playerName;
  const gridColumns = Math.min(Math.max(cards.length || 3, 3), 5);

  return (
    <Flex gap={5} minWidth={300}>
      <Flex direction="row" justify="space-between">
        <Card animation="none" height={65} padding="sm" width={80}>
          <Flex align="center" fullWidth fullHeight justify="center">
            {isCurrentTurn ? <Timer duration={turnDuration} paused={isPaused} /> : <Image variant="lockIcon" width={25} />}
          </Flex>
        </Card>
        <Flex align="center" justify="center">
          <Profile />
          <Typography.Text>{displayName}</Typography.Text>
        </Flex>
      </Flex>

      <Card animation="none" fullWidth padding="sm">
        {cards.length === 0 ? (
          <Flex align="center">
            <Typography.Text tone="secondary">Карт нет</Typography.Text>
          </Flex>
        ) : (
          <IndicatorsGrid $columns={gridColumns}>
            {cards.map((card, index) => (
              <HandCardIndicator
              key={`${card.color}-${index}`}
              count={card.count}
              indicator={getHandCardIndicator(card)}
              size="small"
            />
            ))}
          </IndicatorsGrid>
        )}
      </Card>
    </Flex>
  );
};
