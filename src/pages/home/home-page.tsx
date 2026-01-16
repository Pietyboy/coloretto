import { useMemo, useState } from 'react';

import { GameRoomCard } from '../../features/game-room-card';
import { Components } from '../../shared';
import { Page } from '../../shared/ui/components';
import { useGetGamesListQuery } from '../../store/api/game-api';
import { GameCardsGrid, GameFilters } from '../../widgets';

import { maxPlayersSelectOptions, sortOptions, statusOptions } from './constants';
import { getStatus } from './helpers';
import type { SortFilter, StatusFilter } from './types';

const { Flex } = Components;

export const HomePage = () => {
  const [status, setStatus] = useState<StatusFilter>('all');
  const [hasSeats, setHasSeats] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortFilter>('newest');
  const [maxPlayers, setMaxPlayers] = useState<number[]>([]);

  const { data: gamesData = [], isFetching, isLoading, refetch } = useGetGamesListQuery();

  const filteredGames = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...gamesData]
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
  }, [gamesData, hasSeats, maxPlayers, search, sortBy, status]);

  const emptyText = gamesData.length === 0 ? 'Нет доступных игр' : 'Игры не найдены';

  const resetFilters = () => {
    setStatus('all');
    setHasSeats(false);
    setSearch('');
    setSortBy('newest');
    setMaxPlayers([]);
  };

  return (
    <Page>
      <Flex direction="column" gap={12} fullWidth>
        <GameFilters
          hasSeats={hasSeats}
          isRefreshDisabled={isFetching}
          maxPlayers={maxPlayers}
          maxPlayersOptions={maxPlayersSelectOptions}
          search={search}
          sortBy={sortBy}
          sortOptions={sortOptions}
          status={status}
          statusOptions={statusOptions}
          onMaxPlayersChange={setMaxPlayers}
          onRefresh={refetch}
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
          renderItem={(game) => <GameRoomCard key={game.gameId} game={game} />}
        />
      </Flex>
    </Page>
  );
};
