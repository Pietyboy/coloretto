import { useNotify } from '../../hooks/useNotify';
import { Components } from '../../shared';
import { useGetHostedGamesQuery, usePauseGameMutation, useResumeGameMutation, useStartGameMutation } from '../../store/api/game-api';

import type { TGameStatus } from './types';

const { Button, Card, Flex } = Components;

type GameHostControlsProps = {
  gameId: number;
  gameStatus: TGameStatus;
};

export const GameHostControls = ({ gameId, gameStatus }: GameHostControlsProps) => {
  const notify = useNotify();

  const { data: hostedGames = [] } = useGetHostedGamesQuery(undefined, {
    skip: !gameId,
  });
  const isHost = hostedGames.some(game => game.gameId === gameId);

  const [startGame, { isLoading: isStartingGame }] = useStartGameMutation();
  const [pauseGame, { isLoading: isPausingGame }] = usePauseGameMutation();
  const [resumeGame, { isLoading: isResumingGame }] = useResumeGameMutation();

  const isAnyHostActionLoading = isStartingGame || isPausingGame || isResumingGame;

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
      notify('error', 'Не удалось поставить игру на паузу');
    }
  };

  const handleResumeGame = async () => {
    if (!gameId) return;
    try {
      await resumeGame({ gameId }).unwrap();
      notify('info', 'Игра продолжена');
    } catch (e) {
      notify('error', 'Не удалось продолжить игру');
    }
  };

  if (!isHost || gameStatus === 'finished') return null;

  return (
    <Card animation="none" height={65} padding="sm" width={260}>
      <Flex align="center" direction="row" fullHeight gap={8} justify="center">
        {gameStatus === 'waiting' && (
          <Button
            disabled={isAnyHostActionLoading}
            size="sm"
            variant="primary"
            onClick={handleStartGame}
          >
            Начать
          </Button>
        )}
        {gameStatus === 'in-progress' && (
          <Button
            disabled={isAnyHostActionLoading}
            size="sm"
            variant="outline"
            onClick={handlePauseGame}
          >
            Пауза
          </Button>
        )}
        {gameStatus === 'paused' && (
          <Button
            disabled={isAnyHostActionLoading}
            size="sm"
            variant="outline"
            onClick={handleResumeGame}
          >
            Продолжить
          </Button>
        )}
        {gameStatus === 'unknown' && (
          <>
            <Button
              disabled={isAnyHostActionLoading}
              size="sm"
              variant="primary"
              onClick={handleStartGame}
            >
              Начать
            </Button>
            <Button
              disabled={isAnyHostActionLoading}
              size="sm"
              variant="outline"
              onClick={handlePauseGame}
            >
              Пауза
            </Button>
            <Button
              disabled={isAnyHostActionLoading}
              size="sm"
              variant="outline"
              onClick={handleResumeGame}
            >
              Продолжить
            </Button>
          </>
        )}
      </Flex>
    </Card>
  );
};
