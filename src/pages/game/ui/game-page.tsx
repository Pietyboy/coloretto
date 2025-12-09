import { useEffect, useState } from 'react';

import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { OtherPlayerGameBar } from '../../../features';
import { CardRow } from '../../../features/card-row';
import { Deck } from '../../../features/deck';
import { PlayerGameBar } from '../../../features/player-gamebar';
import { Components } from '../../../shared';
import { Page } from '../../../shared/ui/components';
import type { ImageVariant } from '../../../shared/ui/components/Image/types';
import { useGetGameStateQuery, useMakeTurnCardMutation, useMakeTurnRowMutation } from '../../../store/api/game-api';
import { useAppSelector } from '../../../store/hooks';
import { setGameState } from '../../../store/slices/game-slice';

import { MapGameData, mapHandToUiCards, mapRowCardsToVariants } from './helper';
const { Flex, Typography } = Components;

export const GamePage = () => {
  const params = useParams();
  const gameState = useAppSelector(state => state.game);
  const username = useAppSelector(state => state.profile.username);
  const dispatch = useDispatch();
  const gameId = Number(params.gameId);

  const [draggingCard, setDraggingCard] = useState<null | { cardId: number; variant: ImageVariant }>(null);
  const [activeRowId, setActiveRowId] = useState<null | number>(null);
  const [rowToTake, setRowToTake] = useState<null | number>(null);

  const [makeTurnCard] = useMakeTurnCardMutation();
  const [makeTurnRow, { isLoading: isTakingRow }] = useMakeTurnRowMutation();

  const { data } = useGetGameStateQuery(gameId, {
    pollingInterval: 3000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !gameId,
  });

  useEffect(() => {
    if (data?.state) {
      dispatch(setGameState(MapGameData(data.state, undefined, username)));
    }
  }, [data?.state, dispatch, username]);

  const playerHand = mapHandToUiCards(gameState.playerInfo?.playerHand ?? null);
  const otherPlayers = gameState.otherPlayersInfo.map(player => ({
    ...player,
    cards: mapHandToUiCards(player.playerHand),
  }));

  const isMyTurn = !!gameState.playerInfo?.isCurrentTurn;

  const handleDragStartCard = (card: { cardId: number; variant: ImageVariant }) => {
    setDraggingCard(card);
  };

  const handleDragEndCard = () => {
    setDraggingCard(null);
    setActiveRowId(null);
  };

  const handleRowDrop = async (rowId: number) => {
    if (!draggingCard || !gameState.playerInfo?.playerId || !gameId || !isMyTurn) return;
    const row = gameState.rows.find(r => r.rowId === rowId);
    if (!row || row.cardsCount >= 3) return;

    try {
      await makeTurnCard({
        gameId,
        playerId: gameState.playerInfo.playerId,
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
    const row = gameState.rows.find(r => r.rowId === rowId);
    if (!row || row.cards.length === 0) return;
    setRowToTake(rowId);
  };

  const handleConfirmTakeRow = async () => {
    if (rowToTake === null || !gameId || !gameState.playerInfo?.playerId) return;
    try {
      await makeTurnRow({
        gameId,
        playerId: gameState.playerInfo.playerId,
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

  return (
    <Page>
      <Flex direction="column" gap={50} fullWidth>
        <Flex direction="row" justify="space-evenly">
          {otherPlayers.map((player, index) => (
            <OtherPlayerGameBar
              key={player.playerId ?? index}
              cards={player.cards}
              isCurrentTurn={player.isCurrentTurn}
              playerName={player.playerName}
            />
          ))}
        </Flex>
        <Flex direction="row" justify="space-between" height={269}>
          {gameState.rows.filter(row => row.isActive).map(row => (
            <CardRow
              key={row.rowId}
              cards={mapRowCardsToVariants(row.cards)}
              isActiveDrop={draggingCard !== null && activeRowId === row.rowId && row.cardsCount < 3}
              isDroppable={draggingCard !== null && row.cardsCount < 3 && isMyTurn}
              onDragEnterRow={() => handleRowEnter(row.rowId)}
              onDragLeaveRow={() => handleRowLeave(row.rowId)}
              onDropCard={() => handleRowDrop(row.rowId)}
              onClickRow={() => handleRowClick(row.rowId)}
              disableClick={draggingCard !== null || !isMyTurn}
              isActive={row.isActive}
              rowId={row.rowId}
            />
          ))}
          <Deck
            count={gameState.cardsCount}
            gameId={gameId}
            isCourentTurn={isMyTurn}
            onCardDragEnd={handleDragEndCard}
            onCardDragStart={isMyTurn ? handleDragStartCard : undefined}
            topCardId={gameState.topCard || undefined}
          />
        </Flex>
        <PlayerGameBar cards={playerHand} isCurrentTurn={!!gameState.playerInfo?.isCurrentTurn} />
        <Modal
          centered
          cancelText="Нет"
          okText="Да"
          open={rowToTake !== null}
          confirmLoading={isTakingRow}
          onCancel={handleCancelTakeRow}
          onOk={handleConfirmTakeRow}
        >
          <Typography.Text>Вы точно хотите взять этот ряд?</Typography.Text>
        </Modal>
      </Flex>
    </Page>
  );
};
