import { useEffect, useState } from 'react';

import { Modal } from 'antd';

import { CardRow } from '../../features/card-row';
import { Deck } from '../../features/deck';
import { Components } from '../../shared';
import {
  useChooseColorsMutation,
  useChooseJokerColorsMutation,
  useMakeTurnCardMutation,
  useMakeTurnRowMutation,
} from '../../store/api/game-api';
import type { TCard } from '../../store/api/types';
import type { TRow } from '../../store/types';
import { notify } from '../../ui/notifications/NotificationProvider';

import { JokerColorOptions } from './constants';
import { mapRowCardsToVariants } from './helpers';
import type { TDraggingCard } from './types';

const { Flex, Image, Select, Typography } = Components;

type GameCardSectionProps = {
  cardsCount: number;
  currentPlayerId: number;
  gameId: number;
  isColorModalOpen: boolean;
  isCurrentTurn: boolean;
  isJokerModalOpen: boolean;
  isPaused: boolean;
  playerId: number;
  rows: TRow[];
  topCard?: number;
  unresolvedJokers: TCard[];
};

export const GameCardSection = ({
  cardsCount,
  currentPlayerId,
  gameId,
  isColorModalOpen,
  isCurrentTurn,
  isJokerModalOpen,
  isPaused,
  playerId,
  rows,
  topCard,
  unresolvedJokers,
}: GameCardSectionProps) => {
  const [activeRowId, setActiveRowId] = useState<null | number>(null);
  const [draggingCard, setDraggingCard] = useState<null | TDraggingCard>(null);
  const [jokerColorsByCardId, setJokerColorsByCardId] = useState<Record<number, number>>({});
  const [jokerColorsError, setJokerColorsError] = useState<null | string>(null);
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
    if (!draggingCard || !playerId || !gameId || !isMyTurn) return;
    const row = rows.find(r => r.rowId === rowId);
    if (!row || row.cardsCount >= 3) return;

    try {
      await makeTurnCard({
        gameId,
        playerId,
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
    const row = rows.find(r => r.rowId === rowId);
    if (!row || row.cards.length === 0) return;
    setRowToTake(rowId);
  };

  const handleConfirmTakeRow = async () => {
    if (rowToTake === null || !gameId || !playerId) return;
    try {
      await makeTurnRow({
        gameId,
        playerId,
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
    if (!gameId || !currentPlayerId) return;

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
        playerId: currentPlayerId,
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
    if (!gameId || !currentPlayerId) return;

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
        playerId: currentPlayerId,
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
      <Flex direction="row" height={269} justify="space-between">
        {rows.filter(row => row.isActive).map(row => (
          <CardRow
            key={row.rowId}
            cards={mapRowCardsToVariants(row.cards)}
            disableClick={draggingCard !== null || !isMyTurn}
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
          topCardId={topCard}
          onCardDragEnd={handleDragEndCard}
          onCardDragStart={isMyTurn ? handleDragStartCard : undefined}
          onRevealBlocked={() => notify('warning', 'Все ряды заполнены. Сначала возьмите ряд')}
          onRevealError={(message) => notify('error', message)}
        />
      </Flex>
      <Modal
        centered
        cancelText="Нет"
        confirmLoading={isTakingRow}
        okText="Да"
        open={rowToTake !== null}
        onCancel={handleCancelTakeRow}
        onOk={handleConfirmTakeRow}
      >
        <Typography.Text>Вы точно хотите взять этот ряд?</Typography.Text>
      </Modal>
      <Modal
        centered
        closable={false}
        confirmLoading={isChoosingJokerColors}
        maskClosable={false}
        okText="Подтвердить"
        open={isJokerModalOpen}
        onOk={handleSubmitJokerColors}
      >
        <Flex direction="column" gap={12}>
          <Typography.Text size="regular" weight="medium">
            Выберите цвет для каждого джокера
          </Typography.Text>
          <Flex direction="column" gap={8}>
            {unresolvedJokers.map(joker => {
              const selectedColorId = jokerColorsByCardId[joker.cardId];
              const selectedIndicator = JokerColorOptions.find(option => option.colorId === selectedColorId)?.indicator;

              return (
                <Flex key={joker.cardId} align="center" direction="row" gap={10}>
                  <Image height={29} variant="jokerIndicator" width={27} />
                  <Typography.Text size="medium">→</Typography.Text>
                  {selectedIndicator ? (
                    <Image height={29} variant={selectedIndicator} width={27} />
                  ) : (
                    <Flex height={29} style={{ border: '1px solid #424041', borderRadius: 6 }} width={27} />
                  )}
                  <Select
                    style={{ flex: 1 }}
                    placeholder="Выберите цвет"
                    value={selectedColorId ?? undefined}
                    options={JokerColorOptions.map(option => ({ label: option.label, value: option.colorId }))}
                    onChange={(value) => handleChangeJokerColor(joker.cardId, Number(value))}
                  />
                </Flex>
              );
            })}
          </Flex>
          {jokerColorsError && (
            <Typography.Text tone="danger">{jokerColorsError}</Typography.Text>
          )}
        </Flex>
      </Modal>
      <Modal
        centered
        closable={false}
        confirmLoading={isChoosingColors}
        maskClosable={false}
        okText="Подтвердить"
        open={isColorModalOpen}
        onOk={handleSubmitScoreColors}
      >
        <Flex direction="column" gap={12}>
          <Typography.Text size="regular" weight="medium">
            Выберите 3 цвета для подсчёта очков
          </Typography.Text>
          <Typography.Text tone="secondary">
            Эти 3 цвета будут приносить положительные очки, все остальные — отрицательные.
          </Typography.Text>
          <Flex direction="column" gap={8}>
            {[0, 1, 2].map(index => {
              const selectedColorId = scoreColorIds[index];
              const selectedIndicator = JokerColorOptions.find(option => option.colorId === selectedColorId)?.indicator;
              const selectedOther = scoreColorIds.filter((value, idx) => idx !== index && typeof value === 'number') as number[];

              return (
                <Flex key={index} align="center" direction="row" gap={10}>
                  {selectedIndicator ? (
                    <Image height={29} variant={selectedIndicator} width={27} />
                  ) : (
                    <Flex height={29} style={{ border: '1px solid #424041', borderRadius: 6 }} width={27} />
                  )}
                  <Select
                    style={{ flex: 1 }}
                    placeholder={`Цвет ${index + 1}`}
                    value={selectedColorId ?? undefined}
                    options={JokerColorOptions.map(option => ({
                      disabled: selectedOther.includes(option.colorId),
                      label: option.label,
                      value: option.colorId,
                    }))}
                    onChange={(value) => handleChangeScoreColor(index, Number(value))}
                  />
                </Flex>
              );
            })}
          </Flex>
          {scoreColorsError && (
            <Typography.Text tone="danger">{scoreColorsError}</Typography.Text>
          )}
        </Flex>
      </Modal>
    </>
  );
};
