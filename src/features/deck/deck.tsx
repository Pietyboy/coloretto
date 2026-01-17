import type { DragEventHandler } from 'react';
import { useEffect, useState } from 'react';

import { getCardVariant } from '../../shared/lib/card-variant';
import { Flex, Typography } from '../../shared/ui/components';
import type { ImageVariant } from '../../shared/ui/components/Image/types';
import { useLazyGetGameCardQuery } from '../../store/api/game-api';
import { CardTable } from '../card-table';

import { GameCard, gugiFontStyle } from './constants';
import type { TRevealedCard } from './types';

const { Text } = Typography;

export type DeckProps = {
  count?: number;
  canReveal?: boolean;
  isCurrentTurn: boolean;
  gameId?: number;
  onCardDragStart?: (card: TRevealedCard & { variant: ImageVariant }) => void;
  onCardDragEnd?: () => void;
  onRevealChange?: (isRevealed: boolean) => void;
  onRevealBlocked?: () => void;
  onRevealError?: (message: string) => void;
};

export const Deck = ({
  canReveal = true,
  count = 3,
  gameId,
  isCurrentTurn,
  onCardDragEnd,
  onCardDragStart,
  onRevealBlocked,
  onRevealChange,
  onRevealError,
}: DeckProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [revealedVariant, setRevealedVariant] = useState<ImageVariant | null>(null);
  const [revealedCard, setRevealedCard] = useState<null | TRevealedCard>(null);

  const [loadTopCard, { data: loadedCard, isFetching }] = useLazyGetGameCardQuery();

  const stackCount = Math.min(count ?? 0, 6);
  const isDeckEmpty = count <= 0;
  const displayTopCard =
    isCurrentTurn && isFlipped && revealedVariant ? revealedVariant : GameCard.BackCard;
  const isDraggable = isCurrentTurn && !!revealedVariant && !isDeckEmpty;

  useEffect(() => {
    if (loadedCard) {
      const variant = getCardVariant({ cardColor: loadedCard.color, cardType: loadedCard.type });
      setRevealedVariant(variant);
      setRevealedCard({ cardId: loadedCard.cardId, color: loadedCard.color, type: loadedCard.type });
      setIsFlipped(true);
    }
  }, [loadedCard]);

  useEffect(() => {
    setIsFlipped(false);
    setRevealedVariant(null);
    setRevealedCard(null);
    onRevealChange?.(false);
  }, [count, gameId, onRevealChange]);

  useEffect(() => {
    if (!isCurrentTurn) {
      setIsFlipped(false);
      setRevealedVariant(null);
      setRevealedCard(null);
      onRevealChange?.(false);
    }
  }, [isCurrentTurn, onRevealChange]);

  const handleFlip = async () => {
    if (!gameId || isFetching) return;
    if (isDeckEmpty) return;

    if (revealedVariant) return;
    if (!canReveal) {
      onRevealBlocked?.();
      return;
    }

    try {
      onRevealChange?.(true);
      await loadTopCard({ gameId }).unwrap();
    } catch (e) {
      const message =
        typeof e === 'object' && e && 'data' in e && typeof (e as { data?: unknown }).data === 'object'
          ? ((e as { data?: { error?: unknown } }).data?.error as string | undefined)
          : undefined;
      onRevealError?.(message || 'Не удалось открыть карту');
      onRevealChange?.(false);
    }
  };

  const handleDragStart: DragEventHandler<HTMLDivElement> = event => {
    if (!revealedVariant || !revealedCard) {
      event.preventDefault();
      return;
    }
    onCardDragStart?.({ ...revealedCard, variant: revealedVariant });
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    onCardDragEnd?.();
  };

  return (
    <Flex justify="space-between">
      <Flex
        draggable={isDraggable}
        onClick={isCurrentTurn && !isDeckEmpty ? handleFlip : undefined}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        style={{
          cursor: isDraggable
            ? 'grab'
            : isCurrentTurn && !isDeckEmpty && gameId
              ? canReveal
                ? 'pointer'
                : 'not-allowed'
              : 'default',
          visibility: isDeckEmpty ? 'hidden' : 'visible',
        }}
      >
        <CardTable animation="none" count={stackCount || 1} offset={4} topCard={displayTopCard} />
      </Flex>
      <Flex align="center" direction="row" gap={5} justify="center">
        <Text size="large" style={gugiFontStyle}>
          {count}
        </Text>
      </Flex>
    </Flex>
  );
};
