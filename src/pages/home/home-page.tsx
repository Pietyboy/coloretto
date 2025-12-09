import { useMemo, useState } from 'react';

import { GameRoomCard } from '../../features/game-room-card';
import { Components } from '../../shared';
import { Page } from '../../shared/ui/components';
import { useGetGamesListQuery } from '../../store/api/game-api';
import { TGameApi } from '../../store/api/types';
const { Button, Flex, Input, Select, Spin } = Components;

type StatusFilter = 'all' | 'finished' | 'in-progress';
type SortFilter = 'alpha' | 'newest' | 'oldest';

export const HomePage = () => {
  const { data: gamesData = [], isLoading } = useGetGamesListQuery();
  const [status, setStatus] = useState<StatusFilter>('all');
  const [hasSeats, setHasSeats] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortFilter>('newest');
  const [maxPlayers, setMaxPlayers] = useState<number[]>([]);

  const filteredGames = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...gamesData]
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
  }, [gamesData, hasSeats, maxPlayers, search, sortBy, status]);

  const resetFilters = () => {
    setStatus('all');
    setHasSeats(false);
    setSearch('');
    setSortBy('newest');
    setMaxPlayers([]);
  };

  return (
    <Page>
      <Flex direction='row' align="center" gap={12} wrap>
        <Input
          appearance="solid"
          placeholder="Поиск по названию"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 260, minWidth: 200 }}
        />
        <Select
          placeholder="Статус"
          style={{ width: 180 }}
          value={status}
          onChange={value => setStatus(value as StatusFilter)}
          options={[
            { label: 'Все', value: 'all' },
            { label: 'В игре', value: 'in-progress' },
            { label: 'Завершены', value: 'finished' },
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
          options={[
            { label: '3', value: 3 },
            { label: '4', value: 4 },
            { label: '5', value: 5 },
          ]}
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
      </Flex>
      <Flex direction="row" wrap gap={20} fullWidth style={{ minHeight: 200, position: 'relative' }}>
        {isLoading ? (
          <Flex align="center" justify="center" fullWidth fullHeight>
            <Spin size="large" />
          </Flex>
        ) : (
          filteredGames.map((game) => (
            <GameRoomCard key={game.gameId} game={game}/>
          ))
        )}
      </Flex>
    </Page>
  );
};

const getStatus = (game: TGameApi): StatusFilter => {
  if (game.isFinished) return 'finished';
  return 'in-progress';
};
