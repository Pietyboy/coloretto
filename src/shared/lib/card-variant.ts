import type { ImageVariant } from '../ui/components/Image/types';

type CardLike = {
  cardColor: string;
  cardType: string;
};

export const getCardVariant = (card: CardLike): ImageVariant => {
  const cardType = card.cardType.toLowerCase();
  const cardColor = card.cardColor.toLowerCase();

  if (cardType === '2') {
    return 'plusTwoCard';
  }

  if (cardType === 'joker') {
    return 'jokerCard';
  }

  const normalizedColor = cardColor === 'pink' ? 'purple' : cardColor;

  return `${normalizedColor}Card` as ImageVariant;
};
