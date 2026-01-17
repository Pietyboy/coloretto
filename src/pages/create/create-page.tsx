import { useMemo, useState } from 'react';

import { useNavigate } from 'react-router';

import { GameRoomCard } from '../../features/game-room-card';
import { useNotify } from '../../hooks/useNotify';
import { Components } from '../../shared';
import { addActiveGame, removeActiveGame } from '../../shared/lib/active-games';
import { Page } from '../../shared/ui/components';
import {
  useCreateGameMutation,
  useDeleteGameMutation,
  useGetHostedGamesQuery,
} from '../../store/api/game-api';
import { useAppSelector } from '../../store/hooks';
import {
  type CreateGameFormValues,
  CreateGameModal,
  DeleteGameModal,
  GameCardsGrid,
  GameFilters,
} from '../../widgets';

import {
  maxSeatsSelectOptions,
  sortOptions,
  statusOptions,
  turnTimeSelectOptions,
} from './constants';
import { getStatus } from './helpers';
import type { SortFilter, StatusFilter } from './types';

const { Button, Flex, Form } = Components;

export const CreateGamePage = () => {
  const navigate = useNavigate();
  const username = useAppSelector(state => state.profile.username);
  const notify = useNotify();

  const [createError, setCreateError] = useState<null | string>(null);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [hasSeats, setHasSeats] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortFilter>('newest');
  const [maxPlayers, setMaxPlayers] = useState<number[]>([]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalGameId, setDeleteModalGameId] = useState<null | number>(null);
  const [createForm] = Form.useForm<CreateGameFormValues>();

  const { data: hostedGames = [], isLoading } = useGetHostedGamesQuery();
  const [createGame, { isLoading: isCreating }] = useCreateGameMutation();
  const [deleteGame, { isLoading: isDeleting }] = useDeleteGameMutation();

  const isSubmitting = isCreating;

  const filteredGames = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...hostedGames]
      .filter(game => {
        const currentStatus = getStatus(game);
        if (status !== 'all' && currentStatus !== status) {
          return false;
        }
        const seatsAvailable = game.maxPlayerCount - game.currentPlayersCount;
        if (hasSeats && seatsAvailable <= 0) {
          return false;
        }
        if (maxPlayers.length && !maxPlayers.includes(game.maxPlayerCount)) {
          return false;
        }
        if (normalizedSearch && game.gameName) {
          return game.gameName.toLowerCase().includes(normalizedSearch);
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'alpha') {
          return (a.gameName || '').localeCompare(b.gameName || '');
        }
        if (!a.startingDate || !b.startingDate) return 0;
        const aDate = new Date(a.startingDate).getTime();
        const bDate = new Date(b.startingDate).getTime();
        return sortBy === 'newest' ? bDate - aDate : aDate - bDate;
      });
  }, [hasSeats, hostedGames, maxPlayers, search, sortBy, status]);

  const emptyText = hostedGames.length === 0 ? 'У вас пока нет игр' : 'Игры не найдены';

  const resetFilters = () => {
    setStatus('all');
    setHasSeats(false);
    setSearch('');
    setSortBy('newest');
    setMaxPlayers([]);
  };

  const openCreateModal = () => {
    setCreateModalOpen(true);
    setCreateError(null);
    createForm.setFieldsValue({ nickname: username });
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
    setCreateError(null);
    createForm.resetFields();
  };

  const handleCreate = async (values: CreateGameFormValues) => {
    setCreateError(null);
    try {
      const { gameName, maxSeatsCount, nickname, turnTime } = values;
      const result = await createGame({
        name: gameName,
        nickname,
        seats: maxSeatsCount,
        turnDuration: turnTime,
      }).unwrap();
      const error = (result as { error?: unknown })?.error;
      if (typeof error === 'string' && error.trim()) {
        setCreateError(error);
        return;
      }

      const status = (result as { status?: unknown })?.status;
      const gameIdRaw =
        (result as { gameId?: unknown; game_id?: unknown })?.gameId ??
        (result as { game_id?: unknown })?.game_id;
      const gameId = typeof gameIdRaw === 'number' ? gameIdRaw : Number(gameIdRaw);

      if (status === 'success' && Number.isFinite(gameId) && gameId > 0) {
        notify('success', 'Игра создана');
        addActiveGame({ gameId, gameName });
        closeCreateModal();
        navigate(`/game/${gameId}`);
        return;
      }

      notify('success', 'Игра создана');
      closeCreateModal();
    } catch (err) {
      console.error(err);
      const apiError = err as { data?: { error?: string; message?: string }; error?: string; message?: string };
      const message =
        apiError.data?.error ||
        apiError.data?.message ||
        apiError.error ||
        apiError.message ||
        'Не удалось создать игру';
      setCreateError(message);
      notify('error', 'Не удалось создать игру');
    }
  };

  const handleDeleteGame = (gameId: number) => {
    setDeleteModalGameId(gameId);
  };

  const handleConfirmDeleteGame = async () => {
    if (deleteModalGameId === null) return;

    try {
      const result = await deleteGame({ gameId: deleteModalGameId }).unwrap();
      if ('error' in result) {
        notify('error', 'Не удалось удалить игру');
        return;
      }
      notify('success', 'Игра удалена');
      removeActiveGame(deleteModalGameId);
    } catch (err) {
      console.error(err);
      notify('error', 'Не удалось удалить игру');
    } finally {
      setDeleteModalGameId(null);
    }
  };

  return (
    <Page>
      <Flex direction="column" gap={12} fullWidth>
        <GameFilters
          actionsSlot={(
            <Button
              height={40}
              size="sm"
              variant="primary"
              onClick={openCreateModal}
            >
              Создать игру
            </Button>
          )}
          hasSeats={hasSeats}
          maxPlayers={maxPlayers}
          maxPlayersOptions={maxSeatsSelectOptions}
          search={search}
          sortBy={sortBy}
          sortOptions={sortOptions}
          status={status}
          statusOptions={statusOptions}
          onMaxPlayersChange={setMaxPlayers}
          onReset={resetFilters}
          onSearchChange={setSearch}
          onSortChange={value => setSortBy(value as SortFilter)}
          onStatusChange={value => setStatus(value as StatusFilter)}
          onToggleSeats={() => setHasSeats(prev => !prev)}
        />

        <GameCardsGrid
          emptyText={emptyText}
          isLoading={isLoading}
          items={filteredGames}
          renderItem={(game) => (
            <GameRoomCard key={game.gameId} game={game} onDelete={handleDeleteGame} />
          )}
        />
      </Flex>

      <CreateGameModal
        error={createError}
        form={createForm}
        isOpen={createModalOpen}
        isSubmitting={isSubmitting}
        maxSeatsOptions={maxSeatsSelectOptions}
        turnTimeOptions={turnTimeSelectOptions}
        onCancel={closeCreateModal}
        onFinish={handleCreate}
        onValuesChange={() => setCreateError(null)}
      />

      <DeleteGameModal
        isLoading={isDeleting}
        isOpen={deleteModalGameId !== null}
        onCancel={() => setDeleteModalGameId(null)}
        onConfirm={handleConfirmDeleteGame}
      />
    </Page>
  );
};
