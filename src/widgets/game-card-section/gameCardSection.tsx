import { useEffect, useState } from 'react';

import { CardRow } from '../../features/card-row';
import { Deck } from '../../features/deck';
import { Components } from '../../shared';
import { notify } from '../../shared/ui/notifications/NotificationProvider';
import {
  useChooseColorsMutation,
  useChooseJokerColorsMutation,
  useMakeTurnCardMutation,
  useMakeTurnRowMutation,
} from '../../store/api/game-api';
import type { TCard } from '../../store/api/types';
import type { TRow } from '../../store/types';

import { JokerColorOptions } from './constants';
import { mapRowCardsToVariants } from './helpers';
import { JokerColorsModal } from './joker-colors-modal';
import { ScoreColorsModal } from './score-colors-modal';
import { TakeRowModal } from './take-row-modal';
import type { TDraggingCard } from './types';

const { Flex } = Components;

type GameCardSectionProps = {
  cardsCount: number;
  gameId: number;
  isColorModalOpen: boolean;
  isCurrentTurn: boolean;
  isJokerModalOpen: boolean;
  isPaused: boolean;
  rows: TRow[];
  unresolvedJokers: TCard[];
};

export const GameCardSection = ({
  cardsCount,
  gameId,
  isColorModalOpen,
  isCurrentTurn,
  isJokerModalOpen,
  isPaused,
  rows,
  unresolvedJokers,
}: GameCardSectionProps) => {
  const [activeRowId, setActiveRowId] = useState<null | number>(null);
  const [draggingCard, setDraggingCard] = useState<null | TDraggingCard>(null);
  const [jokerColorsByCardId, setJokerColorsByCardId] = useState<Record<number, number>>({});
  const [jokerColorsError, setJokerColorsError] = useState<null | string>(null);
  const [isTopCardRevealed, setTopCardRevealed] = useState(false);
  const [rowToTake, setRowToTake] = useState<null | number>(null);
  const [scoreColorIds, setScoreColorIds] = useState<Array<null | number>>([null, null, null]);
  const [scoreColorsError, setScoreColorsError] = useState<null | string>(null);

  const [makeTurnCard] = useMakeTurnCardMutation();
  const [makeTurnRow, { isLoading: isTakingRow }] = useMakeTurnRowMutation();
  const [chooseColors, { isLoading: isChoosingColors }] = useChooseColorsMutation();
  const [chooseJokerColors, { isLoading: isChoosingJokerColors }] = useChooseJokerColorsMutation();

  const isMyTurn = isCurrentTurn && !isPaused;
  const canPlaceCardInAnyRow = rows.some(row => row.isActive && row.cardsCount < 3);
  const canRevealTopCard = isMyTurn && canPlaceCardInAnyRow;

  useEffect(() => {
    if (!isPaused) return;
    setActiveRowId(null);
    setDraggingCard(null);
    setTopCardRevealed(false);
    setRowToTake(null);
    setJokerColorsError(null);
    setScoreColorsError(null);
  }, [isPaused]);

  useEffect(() => {
    if (!isJokerModalOpen) {
      setJokerColorsError(null);
    }
  }, [isJokerModalOpen]);

  useEffect(() => {
    if (!isColorModalOpen) {
      setScoreColorsError(null);
    }
  }, [isColorModalOpen]);

  const handleDragStartCard = (card: TDraggingCard) => {
    setDraggingCard(card);
  };

  const handleDragEndCard = () => {
    setDraggingCard(null);
    setActiveRowId(null);
  };

  const handleRowDrop = async (rowId: number) => {
    if (!draggingCard || !gameId || !isMyTurn) return;
    const row = rows.find(r => r.rowId === rowId);
    if (!row || row.cardsCount >= 3) return;

    try {
      await makeTurnCard({
        gameId,
        rowId,
      }).unwrap();
    } catch (e) {
      console.error('Failed to place card to row', e);
    } finally {
      handleDragEndCard();
    }
  };

  const handleRowEnter = (rowId: number) => {
    setActiveRowId(rowId);
  };

  const handleRowLeave = (rowId: number) => {
    if (activeRowId === rowId) {
      setActiveRowId(null);
    }
  };

  const handleRowClick = (rowId: number) => {
    if (draggingCard || !isMyTurn) return;
    if (isTopCardRevealed) {
      notify('warning', 'Сначала положите открытую карту');
      return;
    }
    const row = rows.find(r => r.rowId === rowId);
    if (!row || row.cards.length === 0) return;
    setRowToTake(rowId);
  };

  const handleConfirmTakeRow = async () => {
    if (rowToTake === null || !gameId) return;
    try {
      await makeTurnRow({
        gameId,
        rowId: rowToTake,
      }).unwrap();
    } catch (e) {
      console.error('Failed to take row', e);
    } finally {
      setRowToTake(null);
    }
  };

  const handleCancelTakeRow = () => {
    setRowToTake(null);
  };

  const handleChangeJokerColor = (cardId: number, colorId: number) => {
    setJokerColorsError(null);
    setJokerColorsByCardId(prev => ({ ...prev, [cardId]: colorId }));
  };

  const handleChangeScoreColor = (index: number, colorId: number) => {
    setScoreColorsError(null);
    setScoreColorIds(prev => prev.map((value, idx) => (idx === index ? colorId : value)));
  };

  const handleSubmitScoreColors = async () => {
    if (!gameId) return;

    const selected = scoreColorIds.filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
    const unique = new Set(selected);

    if (selected.length !== 3 || unique.size !== 3) {
      setScoreColorsError('Нужно выбрать 3 разных цвета');
      return;
    }

    setScoreColorsError(null);

    try {
      const result = await chooseColors({
        colorIds: selected,
        gameId,
      }).unwrap();

      if (result.error) {
        setScoreColorsError(result.error);
        return;
      }

      notify('success', 'Цвета для подсчёта сохранены');
    } catch (e) {
      setScoreColorsError('Не удалось сохранить выбор цветов');
    }
  };

  const handleSubmitJokerColors = async () => {
    if (!gameId) return;

    const choices = [];
    for (const joker of unresolvedJokers) {
      const colorId = jokerColorsByCardId[joker.cardId];
      const color = JokerColorOptions.find(option => option.colorId === colorId)?.dbColor;
      if (!color) {
        setJokerColorsError('Выберите цвет для каждого джокера');
        return;
      }
      choices.push({ card_id: joker.cardId, color });
    }

    setJokerColorsError(null);

    try {
      const result = await chooseJokerColors({
        choices,
        gameId,
      }).unwrap();

      if (result.error) {
        setJokerColorsError(result.error);
        return;
      }

      notify('success', 'Цвета для джокеров сохранены');
    } catch (e) {
      setJokerColorsError('Не удалось сохранить выбор цветов для джокеров');
    }
  };

  return (
    <>
      <Flex direction="row" fullWidth height="clamp(240px, 36vh, 269px)" justify="space-between">
        {rows.filter(row => row.isActive).map(row => (
          <CardRow
            key={row.rowId}
            cards={mapRowCardsToVariants(row.cards)}
            disableClick={draggingCard !== null || !isMyTurn || isTopCardRevealed}
            isActive={row.isActive}
            isActiveDrop={draggingCard !== null && activeRowId === row.rowId && row.cardsCount < 3 && isMyTurn}
            isDroppable={draggingCard !== null && row.cardsCount < 3 && isMyTurn}
            rowId={row.rowId}
            onClickRow={() => handleRowClick(row.rowId)}
            onDragEnterRow={() => handleRowEnter(row.rowId)}
            onDragLeaveRow={() => handleRowLeave(row.rowId)}
            onDropCard={() => handleRowDrop(row.rowId)}
          />
        ))}
        <Deck
          canReveal={canRevealTopCard}
          count={cardsCount}
          gameId={gameId}
          isCurrentTurn={isMyTurn}
          onCardDragEnd={handleDragEndCard}
          onCardDragStart={isMyTurn ? handleDragStartCard : undefined}
          onRevealChange={setTopCardRevealed}
          onRevealBlocked={() => notify('warning', 'Все ряды заполнены. Сначала возьмите ряд')}
          onRevealError={(message) => notify('error', message)}
        />
      </Flex>
      <TakeRowModal
        isOpen={rowToTake !== null}
        isSubmitting={isTakingRow}
        onCancel={handleCancelTakeRow}
        onConfirm={handleConfirmTakeRow}
      />
      <JokerColorsModal
        error={jokerColorsError}
        isOpen={isJokerModalOpen}
        isSubmitting={isChoosingJokerColors}
        jokerColorsByCardId={jokerColorsByCardId}
        unresolvedJokers={unresolvedJokers}
        onChangeColor={handleChangeJokerColor}
        onConfirm={handleSubmitJokerColors}
      />
      <ScoreColorsModal
        error={scoreColorsError}
        isOpen={isColorModalOpen}
        isSubmitting={isChoosingColors}
        scoreColorIds={scoreColorIds}
        onChangeColor={handleChangeScoreColor}
        onConfirm={handleSubmitScoreColors}
      />
    </>
  );
};
