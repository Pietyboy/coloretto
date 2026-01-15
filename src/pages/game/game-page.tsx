import { useEffect, useState } from 'react';

import { useParams } from 'react-router';

import { PlayerGameBar } from '../../features/player-gamebar';
import { Components } from '../../shared';
import { Page } from '../../shared/ui/components';
import { useGetGameStateQuery, useGetPlayerForGameQuery } from '../../store/api/game-api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setGameState } from '../../store/slices/game-slice';
import {
  GameCardSection,
  GameFinishWaitingModal,
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
  const gameState = useAppSelector(state => state.game);
  const gameId = Number(params.gameId);

  const [stopPolling, setStopPolling] = useState(false);

  const { data: playerForGame } = useGetPlayerForGameQuery(gameId, {
    refetchOnMountOrArgChange: true,
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
  const playerHand = mapHandToUiCards(gameState.playerInfo?.playerHand ?? null);
  const turnDuration = gameState.turnDuration ?? 40;
  const turnStartTime = gameState.currentTurnStartTime || null;

  const otherPlayers = gameState.otherPlayersInfo.map(player => ({
    ...player,
    cards: mapHandToUiCards(player.playerHand),
  }));

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

  return (
    <Page>
      <Flex fullWidth gap={50} style={GAME_PAGE_GRID_STYLE}>
        <Flex fullHeight fullWidth>
          <OtherPlayerSection
            isPaused={isPaused}
            otherPlayers={otherPlayers}
            turnDuration={turnDuration}
            turnStartTime={turnStartTime}
          />
        </Flex>
        <Flex align="center" fullWidth justify="center">
          <GameCardSection
            cardsCount={gameState.cardsCount}
            currentPlayerId={currentPlayerId ?? -1}
            gameId={gameId}
            isColorModalOpen={!isGameStateError && shouldShowChooseColorsModal}
            isCurrentTurn={gameState.playerInfo?.isCurrentTurn ?? false}
            isJokerModalOpen={!isGameStateError && shouldShowJokerColorsModal}
            isPaused={isPaused}
            playerId={gameState.playerInfo?.playerId ?? -1}
            rows={gameState.rows}
            topCard={gameState.topCard}
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
            turnDuration={turnDuration}
            turnStartTime={turnStartTime}
          />
        </Flex>
      </Flex>
      <GameResultsModal gameId={gameId} open={!isGameStateError && isResultsReady} />
      <GameFinishWaitingModal open={!isGameStateError && shouldShowWaitingOtherPlayersModal} />
      <GameStateErrorModal gameId={gameId} message={gameStateErrorMessage} open={isGameStateError} />
    </Page>
  );
};
