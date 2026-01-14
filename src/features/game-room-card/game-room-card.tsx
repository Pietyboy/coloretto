import { useState } from 'react';

import { useNavigate } from 'react-router';

import { useNotify } from '../../hooks/useNotify';
import { Components } from '../../shared';
import { addActiveGame } from '../../shared/lib/active-games';
import { useCreateNewPlayerMutation, useJoinGameMutation } from '../../store/api/game-api';
import { useAppSelector } from '../../store/hooks';

import { CreatePlayerModal } from './create-player-modal';
import { getErrorMessage, getGameDate, hasTextError } from './helpers';
import type { CreatePlayerFormValues, TGame } from './types';

const { Button, Card, Flex, Form, Typography } = Components;
const { Text } = Typography;

type TGameRoomCard = {
  game: TGame;
  onDelete?: (gameId: number) => void;
};

export const GameRoomCard = ({ game, onDelete }: TGameRoomCard) => {
  const navigate = useNavigate();
  const notify = useNotify();
  const username = useAppSelector(state => state.profile.username);

  const [createPlayerModalOpen, setCreatePlayerModalOpen] = useState(false);
  const [createPlayerError, setCreatePlayerError] = useState<null | string>(null);
  const [createPlayerForm] = Form.useForm<CreatePlayerFormValues>();

  const [joinGame, { isLoading: isJoining }] = useJoinGameMutation();
  const [createNewPlayer, { isLoading: isCreatingPlayer }] = useCreateNewPlayerMutation();

  const isConnecting = isJoining || isCreatingPlayer;
  const gameTitle = game.gameName || game.name || `Игра ${game.gameId}`;
  const playersCountLabel = onDelete
    ? `${game.maxPlayerCount}`
    : `${game.currentPlayersCount}/${game.maxPlayerCount}`;

  const connectToGame = () => {
    addActiveGame({ gameId: game.gameId, gameName: game.gameName || `Игра ${game.gameId}` });
    navigate(`/game/${game.gameId}`);
  };

  const handleGameConnect = async () => {
    setCreatePlayerError(null);

    try {
      const result = await joinGame({ gameId: game.gameId }).unwrap();
      const joinError = (result as { error?: unknown })?.error;
      if (hasTextError(joinError)) {
        notify('error', joinError);
        return;
      }

      const status = (result as { status?: unknown })?.status;
      if (status === 'need_player') {
        setCreatePlayerModalOpen(true);
        createPlayerForm.setFieldsValue({ nickname: username || '' });
        return;
      }

      const playerIdRaw =
        (result as { playerId?: unknown; player_id?: unknown })?.player_id ??
        (result as { playerId?: unknown }).playerId;
      const playerId = typeof playerIdRaw === 'number' ? playerIdRaw : Number(playerIdRaw);

      if (status === 'success' || status === 'ok' || (Number.isFinite(playerId) && playerId > 0)) {
        notify('success', 'Вы подключились к игре');
        connectToGame();
        return;
      }

      notify('error', 'Не удалось подключиться к игре');
    } catch (err) {
      notify('error', getErrorMessage(err, 'Не удалось подключиться к игре'));
    }
  };

  const handleDelete = () => {
    onDelete?.(game.gameId);
  };

  const handleCancelCreatePlayer = () => {
    setCreatePlayerModalOpen(false);
    setCreatePlayerError(null);
    createPlayerForm.resetFields();
  };

  const handleSubmitCreatePlayer = async ({ nickname }: CreatePlayerFormValues) => {
    setCreatePlayerError(null);

    try {
      const result = await createNewPlayer({ gameId: game.gameId, nickname }).unwrap();
      const error = (result as { error?: unknown })?.error;
      if (hasTextError(error)) {
        setCreatePlayerError(error);
        return;
      }

      const status = (result as { status?: unknown })?.status;
      const playerIdRaw =
        (result as { playerId?: unknown; player_id?: unknown })?.player_id ??
        (result as { playerId?: unknown }).playerId;
      const playerId = typeof playerIdRaw === 'number' ? playerIdRaw : Number(playerIdRaw);

      if (status === 'success' || status === 'ok' || (Number.isFinite(playerId) && playerId > 0)) {
        handleCancelCreatePlayer();
        notify('success', 'Вы подключились к игре');
        connectToGame();
        return;
      }

      setCreatePlayerError('Не удалось подключиться к игре');
    } catch (err) {
      setCreatePlayerError(getErrorMessage(err, 'Не удалось подключиться к игре'));
    }
  };

  return (
    <>
      <Card height={230} width={210}>
        <Flex align="start" justify="space-between" fullHeight>
          <Flex align="start" direction="column">
            <Text tone="secondary">
              {onDelete ? `Название: ${gameTitle}` : gameTitle}
            </Text>
            <Text tone="secondary">
              Кол-во игроков: {playersCountLabel}
            </Text>
            <Text tone="secondary">Дата создания: {getGameDate(game.startingDate)}</Text>
          </Flex>
          <Flex direction="column" gap={8} fullWidth>
            <Button
              buttonRadii="sm"
              disabled={isConnecting}
              onClick={handleGameConnect}
              variant="accent"
              fullWidth
            >
              {isConnecting ? 'Подключение...' : 'Подключиться'}
            </Button>
            {onDelete ? (
              <Button buttonRadii="sm" onClick={handleDelete} size="sm" variant="outline" fullWidth>
                Удалить
              </Button>
            ) : null}
          </Flex>
        </Flex>
      </Card>

      <CreatePlayerModal
        error={createPlayerError}
        form={createPlayerForm}
        isOpen={createPlayerModalOpen}
        isSubmitting={isCreatingPlayer}
        onCancel={handleCancelCreatePlayer}
        onFinish={handleSubmitCreatePlayer}
        onValuesChange={() => setCreatePlayerError(null)}
      />
    </>
  );
};
