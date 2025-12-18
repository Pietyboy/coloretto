import { useMemo, useState } from 'react';

import { Modal } from 'antd';

import { GameRoomCard } from '../../features/game-room-card';
import { useNotify } from '../../hooks/useNotify';
import { Components } from '../../shared';
import { removeActiveGame } from '../../shared/lib/active-games';
import { Page } from '../../shared/ui/components';
import {
  useCreateGameMutation,
  useDeleteGameMutation,
  useGetHostedGamesQuery,
} from '../../store/api/game-api';
import type { TGameApi } from '../../store/api/types';
import { useAppSelector } from '../../store/hooks';

const { Button, Flex, Form, Input, Select, Spin, Typography } = Components;

type StatusFilter = 'all' | 'finished' | 'in-progress' | 'waiting';
type SortFilter = 'alpha' | 'newest' | 'oldest';

type CreateGameFormValues = {
  gameName: string;
  maxSeatsCount: number;
  nickname: string;
  turnTime: number;
};

const maxSeatsOptions = [3, 4, 5];
const turnTimeOptions = [20, 30, 40, 50, 60];

export const CreateGamePage = () => {
  const username = useAppSelector(state => state.profile.username);
  const notify = useNotify();
  const { data: hostedGames = [], isLoading } = useGetHostedGamesQuery();
  const [createGame, { isLoading: isCreating }] = useCreateGameMutation();
  const [deleteGame, { isLoading: isDeleting }] = useDeleteGameMutation();
  const isSubmitting = isCreating;

  const [createError, setCreateError] = useState<null | string>(null);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [hasSeats, setHasSeats] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortFilter>('newest');
  const [maxPlayers, setMaxPlayers] = useState<number[]>([]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalGameId, setDeleteModalGameId] = useState<null | number>(null);
  const [createForm] = Form.useForm<CreateGameFormValues>();

  const filteredGames = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...hostedGames]
      .filter((game: TGameApi) => {
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
      .sort((a: TGameApi, b: TGameApi) => {
        if (sortBy === 'alpha') {
          return (a.gameName || '').localeCompare(b.gameName || '');
        }
        if (!a.startingDate || !b.startingDate) return 0;
        const aDate = new Date(a.startingDate).getTime();
        const bDate = new Date(b.startingDate).getTime();
        return sortBy === 'newest' ? bDate - aDate : aDate - bDate;
      });
  }, [hasSeats, hostedGames, maxPlayers, search, sortBy, status]);

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
      const { gameName, maxSeatsCount, turnTime } = values;
      const result = await createGame({ gameName, maxSeatsCount, turnTime }).unwrap();
      const error = (result as { error?: unknown })?.error;
      if (typeof error === 'string' && error.trim()) {
        setCreateError(error);
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
        <Flex direction="row" align="center" gap={12} wrap>
          <Input
            appearance="solid"
            placeholder="Поиск по названию"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 260, minWidth: 200 }}
          />
          <Select
            placeholder="Статус"
            style={{ width: 200 }}
            value={status}
            onChange={value => setStatus(value as StatusFilter)}
            options={[
              { label: 'Все', value: 'all' },
              { label: 'Ожидают игроков', value: 'waiting' },
              { label: 'В процессе', value: 'in-progress' },
              { label: 'Завершённые', value: 'finished' },
            ]}
          />
          <Select
            placeholder="Сортировка"
            style={{ width: 180 }}
            value={sortBy}
            onChange={value => setSortBy(value as SortFilter)}
            options={[
              { label: 'Сначала новые', value: 'newest' },
              { label: 'Сначала старые', value: 'oldest' },
              { label: 'По алфавиту', value: 'alpha' },
            ]}
          />
          <Select
            mode="multiple"
            allowClear
            placeholder="Макс. игроков"
            style={{ minWidth: 160 }}
            value={maxPlayers}
            onChange={value => setMaxPlayers(value as number[])}
            options={maxSeatsOptions.map(v => ({ label: v.toString(), value: v }))}
          />
          <Button
            size="sm"
            variant={hasSeats ? 'accent' : 'outline'}
            onClick={() => setHasSeats(prev => !prev)}
          >
            Есть свободные места
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={resetFilters}
          >
            Сбросить фильтры
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={openCreateModal}
          >
            Создать игру
          </Button>
        </Flex>

        <Flex direction="row" wrap gap={20} fullWidth style={{ minHeight: 200, position: 'relative' }}>
          {isLoading ? (
            <Flex align="center" justify="center" fullWidth fullHeight>
              <Spin size="large" />
            </Flex>
          ) : (
            filteredGames.map((game) => (
              <GameRoomCard key={game.gameId} game={game} onDelete={handleDeleteGame}/>
            ))
          )}
        </Flex>
      </Flex>

      <Modal
        centered
        cancelText="Отмена"
        confirmLoading={isSubmitting}
        okText="Создать"
        open={createModalOpen}
        onCancel={closeCreateModal}
        onOk={() => createForm.submit()}
      >
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          Создать игру
        </Typography.Title>
        <Form<CreateGameFormValues>
          form={createForm}
          layout="vertical"
          requiredMark={false}
          onValuesChange={() => setCreateError(null)}
          onFinish={handleCreate}
        >
          {createError ? (
            <Form.Item style={{ marginBottom: 16 }}>
              <Typography.Text tone="danger">{createError}</Typography.Text>
            </Form.Item>
          ) : null}
          <Form.Item
            label="Название игры"
            name="gameName"
            rules={[{ message: 'Введите название игры', required: true }]}
          >
            <Input appearance="ghostDark" placeholder="Название" />
          </Form.Item>
          <Form.Item
            label="Количество игроков"
            name="maxSeatsCount"
            rules={[{ message: 'Выберите количество игроков', required: true }]}
          >
            <Select
              options={maxSeatsOptions.map(v => ({ label: v.toString(), value: v }))}
              placeholder="3-5"
            />
          </Form.Item>
          <Form.Item
            label="Время на ход (сек)"
            name="turnTime"
            rules={[{ message: 'Выберите время на ход', required: true }]}
          >
            <Select
              options={turnTimeOptions.map(v => ({ label: v.toString(), value: v }))}
              placeholder="20-60"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        centered
        cancelText="Отмена"
        confirmLoading={isDeleting}
        okButtonProps={{ danger: true }}
        okText="Удалить"
        open={deleteModalGameId !== null}
        title="Удалить игру"
        onCancel={() => setDeleteModalGameId(null)}
        onOk={handleConfirmDeleteGame}
      >
        <Typography.Text>Вы точно хотите удалить эту игру?</Typography.Text>
      </Modal>
    </Page>
  );
};

const getStatus = (game: TGameApi): StatusFilter => {
  if (game.isFinished) return 'finished';
  if (game.currentPlayersCount < game.maxPlayerCount) return 'waiting';
  return 'in-progress';
};
