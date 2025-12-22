import { Components } from '../../shared';
import { GameCard } from '../game-card';

import {
  BaseSlot,
  CARD_HEIGHT,
  CARD_WIDTH,
  EmptySlot,
  StackCard,
  StackSlot,
} from './card-table.styled';
import { getOffsetMap } from './helpers';

const { Card } = Components;

export type CardTableProps = {
  animation?: 'default' | 'none' | 'parallax' | 'tilt';
  count: number;
  offset: number;
  onClick?: () => void;
  topCard: string;
};

export const CardTable = ({ animation = 'none', count, offset, onClick, topCard }: CardTableProps) => {
  const offsets = getOffsetMap(offset, count);
  const maxOffset = offsets.length ? Math.max(...offsets) : 0;
  const containerWidth = CARD_WIDTH + maxOffset;
  const containerHeight = CARD_HEIGHT + maxOffset;

  if (count === 0) {
    return <EmptySlot $height={CARD_HEIGHT} $width={CARD_WIDTH} />;
  }

  if (count === 1) {
    return (
      <BaseSlot $height={CARD_HEIGHT} $width={CARD_WIDTH}>
        <GameCard animation="none" height={CARD_HEIGHT} variant={topCard} width={CARD_WIDTH} />
      </BaseSlot>
    );
  }

  return (
    <StackSlot $height={containerHeight} $width={containerWidth}>
      {offsets.map((offsetValue, idx) => (
        <StackCard
          key={`card-in-row-${idx}`}
          $height={CARD_HEIGHT}
          $offset={offsetValue}
          $width={CARD_WIDTH}
        >
          {idx === count - 1 ? (
            <GameCard animation={animation} height={CARD_HEIGHT} variant={topCard} width={CARD_WIDTH} />
          ) : (
            <Card animation="none" height={CARD_HEIGHT} width={CARD_WIDTH} onClick={onClick} />
          )}
        </StackCard>
      ))}
    </StackSlot>
  );
};
