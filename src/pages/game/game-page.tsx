import { useEffect, useState } from 'react';

import { useParams } from 'react-router';

import { PlayerGameBar } from '../../features/player-gamebar';
import { useNotify } from '../../hooks/useNotify';
import { Components } from '../../shared';
import { Page } from '../../shared/ui/components';
import { useGetGameStateQuery, useGetHostedGamesQuery, useGetPlayerForGameQuery, useStartGameMutation } from '../../store/api/game-api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setGameState } from '../../store/slices/game-slice';
import {
  GameCardSection,
  GameFinishWaitingModal,
  GamePausedModal,
  GameResultsModal,
  GameStateErrorModal,
  OtherPlayerSection,
} from '../../widgets';

import { GAME_PAGE_GRID_STYLE } from './constants';
import { getRtkQueryErrorMessage, getUiGameStatus, MapGameData, mapHandToUiCards } from './helpers';

const { Flex } = Components;

export const GamePage = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const notify = useNotify();
  const gameState = useAppSelector(state => state.game);
  const gameId = Number(params.gameId);

  const [stopPolling, setStopPolling] = useState(false);
  const [autoStartRequested, setAutoStartRequested] = useState(false);

  const [startGame] = useStartGameMutation();

  const { data: playerForGame } = useGetPlayerForGameQuery(gameId, {
    refetchOnMountOrArgChange: true,
    skip: !gameId,
  });

  const { data: hostedGames = [], isLoading: isHostedGamesLoading } = useGetHostedGamesQuery(undefined, {
    skip: !gameId,
  });

  const {
    data,
    error: gameStateError,
    isError: isGameStateRequestError,
  } = useGetGameStateQuery(gameId, {
    pollingInterval: stopPolling ? 0 : 3000,
    refetchOnFocus: !stopPolling,
    refetchOnReconnect: !stopPolling,
    skip: !gameId,
  });

  const serverStateError =
    typeof (data?.state as unknown as Record<string, unknown> | undefined)?.error === 'string'
      ? String((data?.state as unknown as Record<string, unknown>).error)
      : null;

  const isGameStateError = isGameStateRequestError || !!serverStateError;
  const gameStateErrorMessage = serverStateError ?? getRtkQueryErrorMessage(gameStateError);
  const gameStatus = getUiGameStatus(data?.state);
  const isPaused = gameStatus === 'paused';
  const isHost = hostedGames.some(game => game.gameId === gameId);
  const shouldShowPauseModal = isPaused && !isHost && !isHostedGamesLoading;
  const playerHand = mapHandToUiCards(gameState.playerInfo?.playerHand ?? null);
  const turnDuration = gameState.turnDuration ?? 40;
  const turnStartTime = gameState.currentTurnStartTime || null;
  const serverNow = typeof data?.state?.serverNow === 'number' ? data?.state?.serverNow : null;
  const turnEndsAt = typeof data?.state?.turnEndsAt === 'number' ? data?.state?.turnEndsAt : null;

  const otherPlayers = gameState.otherPlayersInfo.map(player => ({
    ...player,
    cards: mapHandToUiCards(player.playerHand),
  }));

  const isDeckEmpty = (gameState.cardsCount ?? 0) <= 0;
  const areAllRowsCollected = gameState.rows.length > 0 && gameState.rows.every(row => !row.isActive);
  const isFinalStage = isDeckEmpty && areAllRowsCollected;

  const currentPlayerId = playerForGame?.player_id ?? gameState.playerInfo?.playerId ?? null;
  const playersFromState = Array.isArray(data?.state?.players) ? data?.state?.players : null;
  const maxPlayerCountFromStateRaw =
    data?.state?.maxPlayerCount
    ?? (data?.state as unknown as Record<string, unknown> | undefined)?.max_player_count;
  const maxPlayerCountFromState = Number(maxPlayerCountFromStateRaw);
  const playersCountFromState = playersFromState ? playersFromState.length : null;
  const isReadyToAutoStart =
    isHost
    && !isHostedGamesLoading
    && gameStatus === 'waiting'
    && Number.isFinite(maxPlayerCountFromState)
    && maxPlayerCountFromState > 0
    && playersCountFromState === maxPlayerCountFromState;

  const currentPlayerFromState =
    currentPlayerId && playersFromState
      ? playersFromState.find(player => player.playerId === currentPlayerId) ?? null
      : null;
  const unresolvedJokers =
    currentPlayerFromState?.hand?.filter(
      card => card.type?.toLowerCase() === 'joker' && card.color?.toLowerCase() === 'none'
    ) ?? [];

  const playersColorsStatus = Array.isArray(data?.state?.playersColorsStatus)
    ? data?.state?.playersColorsStatus
    : Array.isArray(data?.state?.players_colors_status)
      ? data?.state?.players_colors_status
      : null;
  const playersJokersStatus = Array.isArray(data?.state?.playersJokersStatus)
    ? data?.state?.playersJokersStatus
    : Array.isArray(data?.state?.players_jokers_status)
      ? data?.state?.players_jokers_status
      : null;

  const currentPlayerColorsRaw = currentPlayerFromState?.colors;
  const currentPlayerSelectedColors = Array.isArray(currentPlayerColorsRaw) ? currentPlayerColorsRaw : [];

  const currentPlayerColorsStatus = currentPlayerId && playersColorsStatus
    ? playersColorsStatus.find(player => player.playerId === currentPlayerId) ?? null
    : null;
  const currentPlayerJokersStatus = currentPlayerId && playersJokersStatus
    ? playersJokersStatus.find(player => player.playerId === currentPlayerId) ?? null
    : null;

  const isCurrentPlayerJokersPicked =
    currentPlayerJokersStatus?.isJokersPicked ?? unresolvedJokers.length === 0;
  const isCurrentPlayerColorsPicked =
    currentPlayerColorsStatus?.isColorsPicked ?? currentPlayerSelectedColors.length === 3;

  const fallbackAllPlayersJokersPicked = playersFromState
    ? playersFromState.every(player => {
        const hand = Array.isArray(player.hand) ? player.hand : [];
        return hand.every(card => card.type?.toLowerCase() !== 'joker' || card.color?.toLowerCase() !== 'none');
      })
    : false;
  const fallbackAllPlayersColorsPicked = playersFromState
    ? playersFromState.every(player => Array.isArray(player.colors) && player.colors.length === 3)
    : false;

  const allPlayersJokersPicked = playersJokersStatus
    ? playersJokersStatus.every(player => player.isJokersPicked)
    : fallbackAllPlayersJokersPicked;
  const allPlayersColorsPicked = playersColorsStatus
    ? playersColorsStatus.every(player => player.isColorsPicked)
    : fallbackAllPlayersColorsPicked;

  const isResultsReady = isFinalStage && gameStatus === 'finished' && allPlayersJokersPicked && allPlayersColorsPicked;

  const shouldShowJokerColorsModal =
    isFinalStage &&
    gameStatus === 'finished' &&
    !isPaused &&
    !isCurrentPlayerJokersPicked &&
    unresolvedJokers.length > 0 &&
    !!currentPlayerId;

  const shouldShowChooseColorsModal =
    isFinalStage &&
    gameStatus === 'finished' &&
    !isPaused &&
    isCurrentPlayerJokersPicked &&
    !isCurrentPlayerColorsPicked &&
    !!currentPlayerId &&
    !shouldShowJokerColorsModal;

  const shouldShowWaitingOtherPlayersModal =
    isFinalStage &&
    gameStatus === 'finished' &&
    !isPaused &&
    isCurrentPlayerJokersPicked &&
    isCurrentPlayerColorsPicked &&
    !isResultsReady;

  useEffect(() => {
    setStopPolling(false);
    setAutoStartRequested(false);
  }, [gameId]);

  useEffect(() => {
    if (isResultsReady || isGameStateError) {
      setStopPolling(true);
    }
  }, [isResultsReady, isGameStateError]);

  useEffect(() => {
    if (data?.state && !serverStateError) {
      dispatch(setGameState(MapGameData(data.state, playerForGame?.player_id, playerForGame?.nickname)));
    }
  }, [data?.state, dispatch, playerForGame?.nickname, playerForGame?.player_id, serverStateError]);

  useEffect(() => {
    if (!gameId || autoStartRequested || !isReadyToAutoStart) return;

    setAutoStartRequested(true);

    startGame({ gameId })
      .unwrap()
      .then((result) => {
        if (result && typeof result === 'object' && 'error' in result && result.error) {
          notify('warning', String(result.error));
        }
      })
      .catch(() => {
        notify('error', 'Не удалось автоматически запустить игру');
      });
  }, [autoStartRequested, gameId, isReadyToAutoStart, notify, startGame]);

  return (
    <Page variant="game">
      <Flex fullWidth style={GAME_PAGE_GRID_STYLE}>
        <Flex fullHeight fullWidth minHeight={0}>
          <OtherPlayerSection
            isPaused={isPaused}
            otherPlayers={otherPlayers}
            serverNow={serverNow}
            turnDuration={turnDuration}
            turnEndsAt={turnEndsAt}
            turnStartTime={turnStartTime}
          />
        </Flex>
        <Flex align="center" fullWidth justify="center">
          <GameCardSection
            cardsCount={gameState.cardsCount}
            gameId={gameId}
            isColorModalOpen={!isGameStateError && shouldShowChooseColorsModal}
            isCurrentTurn={gameState.playerInfo?.isCurrentTurn ?? false}
            isJokerModalOpen={!isGameStateError && shouldShowJokerColorsModal}
            isPaused={isPaused}
            rows={gameState.rows}
            unresolvedJokers={unresolvedJokers}
          />
        </Flex>
        <Flex fullHeight fullWidth justify="end">
          <PlayerGameBar
            cards={playerHand}
            gameId={gameId}
            gameStatus={gameStatus}
            isCurrentTurn={!!gameState.playerInfo?.isCurrentTurn}
            isPaused={isPaused}
            serverNow={serverNow}
            turnDuration={turnDuration}
            turnEndsAt={turnEndsAt}
            turnStartTime={turnStartTime}
          />
        </Flex>
      </Flex>
      <GamePausedModal open={!isGameStateError && shouldShowPauseModal} />
      <GameResultsModal gameId={gameId} open={!isGameStateError && isResultsReady} />
      <GameFinishWaitingModal open={!isGameStateError && shouldShowWaitingOtherPlayersModal} />
      <GameStateErrorModal gameId={gameId} message={gameStateErrorMessage} open={isGameStateError} />
    </Page>
  );
};
