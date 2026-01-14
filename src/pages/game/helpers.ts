import { CardColors, CardType } from '../../features/player-gamebar/constants';
import type { TCard as TPlayerCard } from '../../features/player-gamebar/types';
import { TCard as TApiCard, TGameState as TGameStateApi, TPlayer } from '../../store/api/types';
import { TGameState, TPlayerHand, TPlayerInfo, TCard as TStoreCard } from '../../store/types';

import type { TGameStatus } from './types';

export const getUiGameStatus = (state: unknown): TGameStatus => {
  if (!state || typeof state !== 'object') return 'unknown';

  const stateRecord = state as Record<string, unknown>;
  const candidate = stateRecord.gameStatus ?? stateRecord.status ?? stateRecord.game_status;

  if (typeof candidate === 'string') {
    const normalized = candidate.toLowerCase();
    if (normalized.includes('wait')) return 'waiting';
    if (normalized.includes('pause')) return 'paused';
    if (normalized.includes('finish')) return 'finished';
    if (normalized.includes('progress') || normalized.includes('in_progress') || normalized.includes('inprogress')) return 'active';
  }

  if (stateRecord.isGameFinished === true) return 'finished';

  return 'unknown';
};

const mapPlayer = (player: TPlayer, allowJokerColors: boolean): TPlayerInfo => ({
  isCurrentTurn: player.isCurrentTurn,
  isTurnAvailable: player.isCurrentTurn,
  playerHand: groupCardsByColorAndType(player.hand, { allowJokerColors }),
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
  const allowJokerColors = getUiGameStatus(data) === 'finished';
  const players = data.players ?? [];
  const currentPlayer =
    (playerId !== undefined && playerId !== null
      ? players.find(player => player.playerId === playerId)
      : undefined)
    || (playerNickname
      ? players.find(player => player.nickname === playerNickname)
      : undefined);
  const mapPlayerWithColors = (player: TPlayer) => mapPlayer(player, allowJokerColors);

  return {
    cardsCount: data.remainingCardsCount,
    currentTurnStartTime: data.currentTurnStartTime,
    gameId: data.gameId,
    otherPlayersInfo: (currentPlayer
      ? players.filter(player => player.playerId !== currentPlayer.playerId)
      : players).map(mapPlayerWithColors),
    playerCount: data.maxPlayerCount,
    playerInfo: currentPlayer ? mapPlayerWithColors(currentPlayer) : undefined,
    rows: data.rows?.map(row => ({
      cards: mapRowCards(row.cards),
      cardsCount: row.cards?.length ?? 0,
      isActive: row.isActive ?? true,
      rowId: row.rowId,
    })) ?? [],
    topCard: data.firstDeckCard?.cardId,
    turnDuration: data.turnDuration,
  };
};

type GroupCardsOptions = {
  allowJokerColors?: boolean;
};

export const groupCardsByColorAndType = (
  cards: null | TApiCard[],
  options: GroupCardsOptions = {},
): null | TPlayerHand[] => {
  const map = new Map<string, TPlayerHand>();
  const allowJokerColors = options.allowJokerColors === true;

  if (cards === null) {
    return null;
  }

  cards.forEach(card => {
    const rawColor = typeof card.color === 'string' ? card.color.toLowerCase() : 'none';
    const rawType = typeof card.type === 'string' ? card.type.toLowerCase() : 'common';
    const isJoker = rawType === 'joker';
    const cardColor = isJoker && !allowJokerColors ? 'none' : rawColor;
    const cardType = isJoker && allowJokerColors && cardColor !== 'none' ? 'common' : rawType;
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
