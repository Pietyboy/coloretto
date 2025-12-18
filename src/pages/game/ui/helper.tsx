import { CardColors, CardType } from '../../../features/player-gamebar/constants';
import type { TCard as TPlayerCard } from '../../../features/player-gamebar/types';
import { getCardVariant } from '../../../shared/lib/card-variant';
import { ImageVariant } from '../../../shared/ui/components/Image/types';
import { TCard as TApiCard, TGameState as TGameStateApi, TPlayer } from '../../../store/api/types';
import { TGameState, TPlayerHand, TPlayerInfo, TRow, TCard as TStoreCard } from '../../../store/types';

const mapPlayer = (player: TPlayer): TPlayerInfo => ({
  isCurrentTurn: player.isCurrentTurn,
  isTurnAvailable: player.isCurrentTurn,
  playerHand: groupCardsByColorAndType(player.hand),
  playerId: player.playerId,
  playerName: player.nickname,
});

const mapRowCards = (cards: null | TApiCard[]): TStoreCard[] =>
  (cards ?? []).map(card => ({
    cardColor: card.color.toLowerCase(),
    cardId: card.cardId,
    cardType: card.type.toLowerCase(),
  }));

export const MapGameData = (data: TGameStateApi, playerId?: number, playerNickname?: string): TGameState => {
  const players = data.players ?? [];
  const currentPlayer =
    (playerId !== undefined && playerId !== null
      ? players.find(player => player.playerId === playerId)
      : undefined)
    || (playerNickname
      ? players.find(player => player.nickname === playerNickname)
      : undefined);

  return {
    cardsCount: data.remainingCardsCount,
    currentTurnStartTime: data.currentTurnStartTime,
    gameId: data.gameId,
    otherPlayersInfo: (currentPlayer
      ? players.filter(player => player.playerId !== currentPlayer.playerId)
      : players).map(mapPlayer),
    playerCount: data.maxPlayerCount,
    playerInfo: currentPlayer ? mapPlayer(currentPlayer) : null,
    rows: data.rows?.map(row => ({
      cards: mapRowCards(row.cards),
      cardsCount: row.cards?.length ?? 0,
      isActive: row.isActive ?? true,
      rowId: row.rowId,
    })) ?? [],
    topCard: data.firstDeckCard?.cardId ?? null,
    turnDuration: data.turnDuration,
  };
};

export const groupCardsByColorAndType = (cards: null | TApiCard[] ): null | TPlayerHand[] => {
  const map = new Map<string, TPlayerHand>();

  if (cards === null) {
    return null;
  }

  cards.forEach(card => {
    const cardColor = card.color.toLowerCase();
    const rawType = card.type.toLowerCase();
    const cardType = rawType === 'joker' && cardColor !== 'none' ? 'common' : rawType;
    const key = `${cardColor}__${cardType}`;

    const existing = map.get(key);
    if (existing) {
      existing.cardsCount += 1;
    } else {
      map.set(key, {
        card: { cardColor, cardId: card.cardId, cardType },
        cardsCount: 1,
      });
    }
  });

  return Array.from(map.values());
};

export const normalizeColor = (color?: string): typeof CardColors[keyof typeof CardColors] => {
  const normalized = color?.toLowerCase();
  if (normalized === 'pink') return CardColors.purple;
  const key = normalized as keyof typeof CardColors | undefined;
  return (key && CardColors[key]) || CardColors.none;
};

export const normalizeType = (type?: string): typeof CardType[keyof typeof CardType] => {
  const normalized = type?.toLowerCase();
  if (normalized === '2') return CardType[2];
  if (normalized === 'joker') return CardType.joker;
  return CardType.common;
};

export const mapHandToUiCards = (hand: null | TPlayerHand[]): TPlayerCard[] =>
  (hand ?? []).map(handItem => ({
    color: normalizeColor(handItem.card.cardColor),
    count: handItem.cardsCount,
    type: normalizeType(handItem.card.cardType),
  }));

export  const mapRowCardsToVariants = (cards: TRow['cards']): ImageVariant[] =>
  (cards ?? []).map(card => getCardVariant(card));
