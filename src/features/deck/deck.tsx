import type { DragEventHandler } from "react";
import { useEffect, useState } from "react";

import { getCardVariant } from "../../shared/lib/card-variant";
import { Flex, Typography } from "../../shared/ui/components";
import type { ImageVariant } from "../../shared/ui/components/Image/types";
import { useLazyGetGameCardQuery } from "../../store/api/game-api";
import { CardTable } from "../card-table";

import { GameCard, gugiFontStyle } from "./constants";

const {Text} = Typography;

type RevealedCard = {
  cardId: number;
  color: string;
  type: string;
};

export type DeckProps = {
  count?: number;
  canReveal?: boolean;
  isCourentTurn: boolean;
  gameId?: number;
  topCardId?: number;
  onCardDragStart?: (card: RevealedCard & { variant: ImageVariant }) => void;
  onCardDragEnd?: () => void;
  onRevealBlocked?: () => void;
  onRevealError?: (message: string) => void;
};

export const Deck = ({
  canReveal = true,
  count = 3,
  gameId,
  isCourentTurn,
  onCardDragEnd,
  onCardDragStart,
  onRevealBlocked,
  onRevealError,
  topCardId,
}: DeckProps) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [revealedVariant, setRevealedVariant] = useState<ImageVariant | null>(null);
    const [revealedCard, setRevealedCard] = useState<null | RevealedCard>(null);
    const [loadTopCard, { data: loadedCard, isFetching }] = useLazyGetGameCardQuery();
    const stackCount = Math.min(count ?? 0, 6);
    const isDeckEmpty = count <= 0;
    const displayTopCard = isFlipped && revealedVariant ? revealedVariant : GameCard.BackCard;
    const isDraggable = isCourentTurn && !!revealedVariant && !isDeckEmpty;

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
    }, [topCardId, gameId]);

    const handleFlip = async () => {
      if (!topCardId || !gameId || isFetching) return;
      if (isDeckEmpty) return;

      if (revealedVariant) return;
      if (!canReveal) {
        onRevealBlocked?.();
        return;
      }

      try {
        await loadTopCard({ cardId: topCardId, gameId }).unwrap();
      } catch (e) {
        const message =
          typeof e === 'object' && e && 'data' in e && typeof (e as { data?: unknown }).data === 'object'
            ? ((e as { data?: { error?: unknown } }).data?.error as string | undefined)
            : undefined;
        onRevealError?.(message || 'Не удалось открыть карту');
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

    return(
        <Flex justify="space-between">
          <Flex
            draggable={isDraggable}
            onClick={isCourentTurn && !isDeckEmpty ? handleFlip : undefined}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            style={{
              cursor: isDraggable
                ? 'grab'
                : isCourentTurn && topCardId && gameId
                  ? canReveal
                    ? 'pointer'
                    : 'not-allowed'
                  : 'default',
              visibility: isDeckEmpty ? 'hidden' : 'visible',
            }}
          >
            <CardTable animation="none" count={stackCount || 1} offset={4} topCard={displayTopCard}/>
          </Flex>
          <Flex align="center" direction="row" gap={5} justify="center">
            <Text style={gugiFontStyle} size="large">{count}</Text>
          </Flex>
        </Flex>
    );
}
