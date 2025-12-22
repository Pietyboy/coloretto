import { getCardVariant } from '../../shared/lib/card-variant';
import type { ImageVariant } from '../../shared/ui/components/Image/types';
import type { TRow } from '../../store/types';

export const mapRowCardsToVariants = (cards: TRow['cards']): ImageVariant[] =>
  (cards ?? []).map(card => getCardVariant(card));

