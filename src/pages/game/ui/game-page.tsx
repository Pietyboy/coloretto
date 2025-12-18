import { useEffect, useState } from 'react';

import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { OtherPlayerGameBar } from '../../../features';
import { CardRow } from '../../../features/card-row';
import { Deck } from '../../../features/deck';
import { PlayerGameBar } from '../../../features/player-gamebar';
import { useNotify } from '../../../hooks/useNotify';
import { Components } from '../../../shared';
import { Page } from '../../../shared/ui/components';
import type { ImageVariant } from '../../../shared/ui/components/Image/types';
import {
  useChooseColorsMutation,
  useChooseJokerColorsMutation,
  useGetGameScoresQuery,
  useGetGameStateQuery,
  useGetHostedGamesQuery,
  useGetPlayerForGameQuery,
  useMakeTurnCardMutation,
  useMakeTurnRowMutation,
  usePauseGameMutation,
  useResumeGameMutation,
  useStartGameMutation,
} from '../../../store/api/game-api';
import { useAppSelector } from '../../../store/hooks';
import { setGameState } from '../../../store/slices/game-slice';

import { MapGameData, mapHandToUiCards, mapRowCardsToVariants } from './helper';
const { Button, Card, Flex, Image, Select, Typography } = Components;

type TUiGameStatus = 'finished' | 'in-progress' | 'paused' | 'unknown' | 'waiting';

const JOKER_COLOR_OPTIONS: Array<{ colorId: number; dbColor: string; label: string; indicator: ImageVariant }> = [
  { colorId: 6, dbColor: 'Blue', indicator: 'blueIndicator', label: 'Синий' },
  { colorId: 3, dbColor: 'Brown', indicator: 'brownIndicator', label: 'Коричневый' },
  { colorId: 1, dbColor: 'Green', indicator: 'greenIndicator', label: 'Зелёный' },
  { colorId: 7, dbColor: 'Orange', indicator: 'orangeIndicator', label: 'Оранжевый' },
  { colorId: 4, dbColor: 'Pink', indicator: 'purpleIndicator', label: 'Фиолетовый' },
  { colorId: 5, dbColor: 'Red', indicator: 'redIndicator', label: 'Красный' },
  { colorId: 2, dbColor: 'Yellow', indicator: 'yellowIndicator', label: 'Жёлтый' },
];

const getUiGameStatus = (state: unknown): TUiGameStatus => {
  if (!state || typeof state !== 'object') return 'unknown';

  const stateRecord = state as Record<string, unknown>;
  const candidate = stateRecord.gameStatus ?? stateRecord.status ?? stateRecord.game_status;

  if (typeof candidate === 'string') {
    const normalized = candidate.toLowerCase();
    if (normalized.includes('wait')) return 'waiting';
    if (normalized.includes('pause')) return 'paused';
    if (normalized.includes('finish')) return 'finished';
    if (normalized.includes('progress') || normalized.includes('in_progress') || normalized.includes('inprogress')) return 'in-progress';
  }

  if (stateRecord.isGameFinished === true) return 'finished';

  return 'unknown';
};

type TGameScoreRow = {
  nickname: string;
  playerId: null | number;
  score: number;
};

const normalizeGameScores = (scores: unknown): TGameScoreRow[] => {
  if (!scores) return [];

  const list: unknown[] = Array.isArray(scores)
    ? scores
    : (typeof scores === 'object'
        && Array.isArray((scores as Record<string, unknown>).scores)
        && (scores as Record<string, unknown>).scores as unknown[])
      || (typeof scores === 'object'
        && Array.isArray((scores as Record<string, unknown>).players)
        && (scores as Record<string, unknown>).players as unknown[])
      || [];

  return list
    .map(item => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;

      const playerIdCandidate = record.playerId ?? record.player_id ?? record.id;
      const playerIdRaw = Number(playerIdCandidate);
      const playerId = Number.isFinite(playerIdRaw) ? playerIdRaw : null;

      const nicknameCandidate = record.nickname ?? record.playerName ?? record.player_name ?? record.name;
      const nickname =
        typeof nicknameCandidate === 'string' && nicknameCandidate.trim()
          ? nicknameCandidate.trim()
          : playerId
            ? `Игрок ${playerId}`
            : 'Игрок';

      const scoreCandidate = record.score ?? record.points ?? record.total ?? record.total_score ?? record.sum;
      const scoreRaw = Number(scoreCandidate);
      const score = Number.isFinite(scoreRaw) ? scoreRaw : 0;

      return { nickname, playerId, score };
    })
    .filter((row): row is TGameScoreRow => Boolean(row))
    .sort((a, b) => b.score - a.score);
};

export const GamePage = () => {
  const params = useParams();
  const gameState = useAppSelector(state => state.game);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gameId = Number(params.gameId);
  const notify = useNotify();

  const [draggingCard, setDraggingCard] = useState<null | { cardId: number; variant: ImageVariant }>(null);
  const [activeRowId, setActiveRowId] = useState<null | number>(null);
  const [rowToTake, setRowToTake] = useState<null | number>(null);
  const [jokerColorsByCardId, setJokerColorsByCardId] = useState<Record<number, number>>({});
  const [jokerColorsError, setJokerColorsError] = useState<null | string>(null);
  const [scoreColorIds, setScoreColorIds] = useState<Array<null | number>>([null, null, null]);
  const [scoreColorsError, setScoreColorsError] = useState<null | string>(null);
  const [stopPolling, setStopPolling] = useState(false);

  const { data: hostedGames = [] } = useGetHostedGamesQuery(undefined, {
    skip: !gameId,
  });
  const isHost = hostedGames.some(game => game.gameId === gameId);

  const [startGame, { isLoading: isStartingGame }] = useStartGameMutation();
  const [pauseGame, { isLoading: isPausingGame }] = usePauseGameMutation();
  const [resumeGame, { isLoading: isResumingGame }] = useResumeGameMutation();

  const [makeTurnCard] = useMakeTurnCardMutation();
  const [makeTurnRow, { isLoading: isTakingRow }] = useMakeTurnRowMutation();
  const [chooseColors, { isLoading: isChoosingColors }] = useChooseColorsMutation();
  const [chooseJokerColors, { isLoading: isChoosingJokerColors }] = useChooseJokerColorsMutation();

  const { data: playerForGame } = useGetPlayerForGameQuery(gameId, {
    refetchOnMountOrArgChange: true,
    skip: !gameId,
  });

  const { data } = useGetGameStateQuery(gameId, {
    pollingInterval: stopPolling ? 0 : 3000,
    refetchOnFocus: !stopPolling,
    refetchOnReconnect: !stopPolling,
    skip: !gameId,
  });

  useEffect(() => {
    if (data?.state) {
      dispatch(setGameState(MapGameData(data.state, playerForGame?.player_id, playerForGame?.nickname)));
    }
  }, [data?.state, dispatch, playerForGame?.nickname, playerForGame?.player_id]);

  const playerHand = mapHandToUiCards(gameState.playerInfo?.playerHand ?? null);
  const otherPlayers = gameState.otherPlayersInfo.map(player => ({
    ...player,
    cards: mapHandToUiCards(player.playerHand),
  }));

  const canPlaceCardInAnyRow = gameState.rows.some(row => row.isActive && row.cardsCount < 3);
  const turnDuration = gameState.turnDuration ?? 40;
  const gameStatus = getUiGameStatus(data?.state);
  const isPaused = gameStatus === 'paused';
  const isMyTurn = !!gameState.playerInfo?.isCurrentTurn && !isPaused;
  const canRevealTopCard = isMyTurn && canPlaceCardInAnyRow;

  const isDeckEmpty = (gameState.cardsCount ?? 0) <= 0;
  const areAllRowsCollected = gameState.rows.length > 0 && gameState.rows.every(row => !row.isActive);
  const isFinalStage = isDeckEmpty && areAllRowsCollected;

  const currentPlayerId = playerForGame?.player_id ?? gameState.playerInfo?.playerId ?? null;
  const playersFromState = Array.isArray(data?.state?.players) ? data?.state?.players : null;
  const currentPlayerFromState =
    currentPlayerId && playersFromState
      ? playersFromState.find(player => player.playerId === currentPlayerId) ?? null
      : null;
  const unresolvedJokers =
    currentPlayerFromState?.hand?.filter(
      card => card.type?.toLowerCase() === 'joker' && card.color?.toLowerCase() === 'none',
    ) ?? [];
  const shouldShowJokerColorsModal = isFinalStage && !isPaused && unresolvedJokers.length > 0 && !!currentPlayerId;

  const allPlayersHaveColoredJokers = playersFromState
    ? playersFromState.every(player => {
      const hand = Array.isArray(player.hand) ? player.hand : [];
      return hand.every(card => card.type?.toLowerCase() !== 'joker' || card.color?.toLowerCase() !== 'none');
    })
    : false;
  const allPlayersSelectedColors = playersFromState
    ? playersFromState.every(player => Array.isArray(player.colors) && player.colors.length === 3)
    : false;
  const isResultsReady = isFinalStage && gameStatus === 'finished' && allPlayersHaveColoredJokers && allPlayersSelectedColors;
  const currentPlayerColorsRaw = currentPlayerFromState?.colors;
  const currentPlayerSelectedColors = Array.isArray(currentPlayerColorsRaw) ? currentPlayerColorsRaw : [];
  const shouldShowChooseColorsModal = isFinalStage
    && gameStatus === 'finished'
    && !isPaused
    && allPlayersHaveColoredJokers
    && currentPlayerSelectedColors.length !== 3
    && !!currentPlayerId;

  const { data: gameScoresData, isFetching: isFetchingGameScores } = useGetGameScoresQuery(gameId, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
    skip: !gameId || !isResultsReady,
  });

  useEffect(() => {
    setStopPolling(false);
  }, [gameId]);

  useEffect(() => {
    setStopPolling(isResultsReady);
  }, [isResultsReady]);

  useEffect(() => {
    if (!isPaused) return;
    setActiveRowId(null);
    setDraggingCard(null);
    setRowToTake(null);
    setJokerColorsError(null);
    setScoreColorsError(null);
  }, [isPaused]);

  useEffect(() => {
    if (!shouldShowJokerColorsModal) {
      setJokerColorsError(null);
    }
  }, [shouldShowJokerColorsModal]);

  useEffect(() => {
    if (!shouldShowChooseColorsModal) {
      setScoreColorsError(null);
    }
  }, [shouldShowChooseColorsModal]);

  const handleStartGame = async () => {
    if (!gameId) return;
    try {
      const result = await startGame({ gameId }).unwrap();
      if ('error' in result && result.error) {
        notify('warning', result.error);
        return;
      }
      notify('info', 'Игра запущена');
    } catch (e) {
      notify('error', 'Не удалось запустить игру');
    }
  };

  const handlePauseGame = async () => {
    if (!gameId) return;
    try {
      const result = await pauseGame({ gameId }).unwrap();

      if ('error' in result && result.error) {
        notify('warning', result.error);
        return;
      }
      notify('info', 'Игра поставлена на паузу');
    } catch (e) {
      console.error('Failed to pause game', e);
      notify('error', 'Не удалось поставить игру на паузу');
    }
  };

  const handleResumeGame = async () => {
    if (!gameId) return;
    try {
      await resumeGame({ gameId }).unwrap();
      notify('info', 'Игра продолжена');
    } catch (e) {
      console.error('Failed to resume game', e);
      notify('error', 'Не удалось продолжить игру');
    }
  };

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
      console.error('Failed to choose score colors', e);
      setScoreColorsError('Не удалось сохранить выбор цветов');
    }
  };

  const handleSubmitJokerColors = async () => {
    if (!gameId || !currentPlayerId) return;

    const choices = [];
    for (const joker of unresolvedJokers) {
      const colorid = jokerColorsByCardId[joker.cardId];
      const color = JOKER_COLOR_OPTIONS.find(option => option.colorId === colorid)?.dbColor;
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
      console.error('Failed to choose joker colors', e);
      setJokerColorsError('Не удалось сохранить выбор цветов для джокеров');
    }
  };

  const renderHostControls = () => {
    if (!isHost || gameStatus === 'finished') return null;

    const isAnyHostActionLoading = isStartingGame || isPausingGame || isResumingGame;

    return (
      <Card animation="none" height={65} padding="sm" width={260}>
        <Flex align="center" direction="row" fullHeight gap={8} justify="center">
          {gameStatus === 'waiting' && (
            <Button disabled={isAnyHostActionLoading} size="sm" variant="primary" onClick={handleStartGame}>
              Начать
            </Button>
          )}
          {gameStatus === 'in-progress' && (
            <Button disabled={isAnyHostActionLoading} size="sm" variant="outline" onClick={handlePauseGame}>
              Пауза
            </Button>
          )}
          {gameStatus === 'paused' && (
            <Button disabled={isAnyHostActionLoading} size="sm" variant="outline" onClick={handleResumeGame}>
              Продолжить
            </Button>
          )}
          {gameStatus === 'unknown' && (
            <>
              <Button disabled={isAnyHostActionLoading} size="sm" variant="primary" onClick={handleStartGame}>
                Начать
              </Button>
              <Button disabled={isAnyHostActionLoading} size="sm" variant="outline" onClick={handlePauseGame}>
                Пауза
              </Button>
              <Button disabled={isAnyHostActionLoading} size="sm" variant="outline" onClick={handleResumeGame}>
                Продолжить
              </Button>
            </>
          )}
        </Flex>
      </Card>
    );
  };

  const scoreRows = normalizeGameScores(gameScoresData?.scores);

  return (
    <Page>
      <Flex direction="column" gap={50} fullWidth>
        <Flex direction="row" justify="space-evenly">
          {otherPlayers.map((player, index) => (
            <OtherPlayerGameBar
              key={player.playerId ?? index}
              cards={player.cards}
              isCurrentTurn={player.isCurrentTurn}
              isPaused={isPaused}
              playerName={player.playerName}
              turnDuration={turnDuration}
            />
          ))}
        </Flex>
        <Flex direction="row" justify="space-between" height={269}>
          {gameState.rows.filter(row => row.isActive).map(row => (
            <CardRow
              key={row.rowId}
              cards={mapRowCardsToVariants(row.cards)}
              isActiveDrop={draggingCard !== null && activeRowId === row.rowId && row.cardsCount < 3 && isMyTurn}
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
            canReveal={canRevealTopCard}
            count={gameState.cardsCount}
            gameId={gameId}
            isCourentTurn={isMyTurn}
            onCardDragEnd={handleDragEndCard}
            onCardDragStart={isMyTurn ? handleDragStartCard : undefined}
            onRevealBlocked={() => notify('warning', 'Все ряды заполнены. Сначала возьмите ряд')}
            onRevealError={(message) => notify('error', message)}
            topCardId={gameState.topCard || undefined}
          />
        </Flex>
        <Flex align="center" direction="row" fullWidth gap={12} wrap>
          <Flex style={{ flex: 1, minWidth: 0 }}>
            <PlayerGameBar cards={playerHand} isCurrentTurn={!!gameState.playerInfo?.isCurrentTurn} isPaused={isPaused} turnDuration={turnDuration} />
          </Flex>
          {renderHostControls()}
        </Flex>
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
        <Modal
          centered
          closable={false}
          maskClosable={false}
          okText="Подтвердить"
          open={shouldShowJokerColorsModal}
          confirmLoading={isChoosingJokerColors}
          onOk={handleSubmitJokerColors}
        >
          <Flex direction="column" gap={12}>
            <Typography.Text size="regular" weight="medium">
              Выберите цвет для каждого джокера
            </Typography.Text>
            <Flex direction="column" gap={8}>
              {unresolvedJokers.map(joker => {
                const selectedColorId = jokerColorsByCardId[joker.cardId];
                const selectedIndicator = JOKER_COLOR_OPTIONS.find(option => option.colorId === selectedColorId)?.indicator;

                return (
                  <Flex key={joker.cardId} align="center" direction="row" gap={10}>
                    <Image height={29} variant="jokerIndicator" width={27} />
                    <Typography.Text size="medium">→</Typography.Text>
                    {selectedIndicator ? (
                      <Image height={29} variant={selectedIndicator} width={27} />
                    ) : (
                      <Flex
                        height={29}
                        style={{ border: '1px solid #424041', borderRadius: 6 }}
                        width={27}
                      />
                    )}
                    <Select
                      style={{ flex: 1 }}
                      placeholder="Выберите цвет"
                      value={selectedColorId ?? undefined}
                      options={JOKER_COLOR_OPTIONS.map(option => ({ label: option.label, value: option.colorId }))}
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
          maskClosable={false}
          okText="Подтвердить"
          open={shouldShowChooseColorsModal}
          confirmLoading={isChoosingColors}
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
                const selectedIndicator = JOKER_COLOR_OPTIONS.find(option => option.colorId === selectedColorId)?.indicator;
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
                      options={JOKER_COLOR_OPTIONS.map(option => ({
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
        <Modal
          centered
          closable={false}
          footer={(
            <Button size="md" variant="primary" onClick={() => navigate('/')}>
              К списку игр
            </Button>
          )}
          maskClosable={false}
          open={isResultsReady}
        >
          <Flex direction="column" gap={12}>
            <Typography.Text size="medium" weight="semibold">
              Итоги игры
            </Typography.Text>
            {isFetchingGameScores && (
              <Typography.Text tone="secondary">Получаем таблицу результатов...</Typography.Text>
            )}
            {!isFetchingGameScores && scoreRows.length === 0 && (
              <Typography.Text tone="secondary">Не удалось получить таблицу результатов</Typography.Text>
            )}
            {scoreRows.length > 0 && (
              <Flex direction="column" gap={8}>
                <Flex direction="row" gap={12}>
                  <Flex style={{ width: 36 }}>
                    <Typography.Text tone="secondary">#</Typography.Text>
                  </Flex>
                  <Flex style={{ flex: 1, minWidth: 0 }}>
                    <Typography.Text tone="secondary">Игрок</Typography.Text>
                  </Flex>
                  <Flex justify="end" style={{ width: 80 }}>
                    <Typography.Text tone="secondary">Очки</Typography.Text>
                  </Flex>
                </Flex>
                {scoreRows.map((row, index) => (
                  <Flex key={row.playerId ?? index} direction="row" gap={12}>
                    <Flex style={{ width: 36 }}>
                      <Typography.Text>{index + 1}</Typography.Text>
                    </Flex>
                    <Flex style={{ flex: 1, minWidth: 0 }}>
                      <Typography.Text ellipsis>{row.nickname}</Typography.Text>
                    </Flex>
                    <Flex justify="end" style={{ width: 80 }}>
                      <Typography.Text>{row.score}</Typography.Text>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            )}
          </Flex>
        </Modal>
      </Flex>
    </Page>
  );
};
