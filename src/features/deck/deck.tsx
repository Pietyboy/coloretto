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
  isCourentTurn: boolean;
  gameId?: number;
  topCardId?: number;
  onCardDragStart?: (card: RevealedCard & { variant: ImageVariant }) => void;
  onCardDragEnd?: () => void;
};

export const Deck = ({ count = 3, gameId, isCourentTurn, onCardDragEnd, onCardDragStart, topCardId }: DeckProps) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [revealedVariant, setRevealedVariant] = useState<ImageVariant | null>(null);
    const [revealedCard, setRevealedCard] = useState<null | RevealedCard>(null);
    const [loadTopCard, { data: loadedCard, isFetching }] = useLazyGetGameCardQuery();
    const stackCount = Math.min(count ?? 0, 6);
    const displayTopCard = isFlipped && revealedVariant ? revealedVariant : GameCard.BackCard;

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

      if (revealedVariant) return;

      try {
        await loadTopCard({ cardId: topCardId, gameId }).unwrap();
      } catch (e) {
        console.error('Failed to load top card', e);
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
            draggable={!!revealedVariant}
            onClick={isCourentTurn ? handleFlip : undefined}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            style={{ cursor: topCardId && gameId ? 'pointer' : 'default' }}
          >
            <CardTable animation="none" count={stackCount || 1} offset={4} topCard={displayTopCard}/>
          </Flex>
          <Flex align="center" direction="row" gap={5} justify="center">
            <Text style={gugiFontStyle} size="large">{count}</Text>
          </Flex>
        </Flex>
    );
}
