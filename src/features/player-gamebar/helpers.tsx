import type { ImageVariant } from '../../shared/ui/components/Image/types';

import { CardColors, CardType } from './constants';
import type { TCard } from './types';

export const getHandCardIndicator = (card: TCard): ImageVariant => {
  if (card.type === CardType.common) {
    switch (card.color) {
      case CardColors.blue:
        return 'blueIndicator';
      case CardColors.brown:
        return 'brownIndicator';
      case CardColors.orange:
        return 'orangeIndicator';
      case CardColors.purple:
        return 'purpleIndicator';
      case CardColors.red:
        return 'redIndicator';
      case CardColors.green:
        return 'greenIndicator';
      default:
        return 'yellowIndicator';
    }
  }
  switch (card.type) {
    case CardType[2]:
      return 'plusTwoIndicator';
    default:
      return 'jokerIndicator';
  }
};
