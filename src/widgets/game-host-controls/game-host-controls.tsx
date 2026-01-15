import { useNotify } from '../../hooks/useNotify';
import { Components } from '../../shared';
import { useGetHostedGamesQuery, usePauseGameMutation, useResumeGameMutation, useStartGameMutation } from '../../store/api/game-api';

import { ButtonHeight } from './constants';
import type { TGameStatus } from './types';

const { Button, Flex } = Components;

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

  const getHandleAction = (status: string) => {
    switch(status) {
      case 'waiting': {
        return handleStartGame;
      }
      case 'paused': {
        return handleResumeGame;
      }
      default: {
        return handlePauseGame;
      }
    }
  }

  const getButtonText = (status: string) => {
    switch(status) {
      case 'waiting': {
        return 'Начать';
      }
      case 'paused': {
        return 'Продолжить';
      }
      default: {
        return 'Пауза';
      }
    }
  }

  if (!isHost || gameStatus === 'finished') return null;

  return (
      <Flex align="center" direction="row" fullHeight gap={8} justify="center">
          <Button
            disabled={isAnyHostActionLoading}
            height={ButtonHeight}
            size="sm"
            variant="primary"
            onClick={getHandleAction(gameStatus)}
            minWidth={60}
          >
            {getButtonText(gameStatus)}
          </Button>
      </Flex>
  );
};
