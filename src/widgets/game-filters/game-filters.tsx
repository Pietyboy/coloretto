import type { ReactNode } from 'react';

import { ReloadOutlined } from '@ant-design/icons';

import { Components } from '../../shared';

import type { SelectOption } from './types';

const { Button, Flex, Input, Select } = Components;

type GameFiltersProps<TStatus extends string, TSort extends string> = {
  actionsSlot?: ReactNode;
  hasSeats: boolean;
  isRefreshDisabled?: boolean;
  maxPlayers: number[];
  maxPlayersOptions: SelectOption<number>[];
  onMaxPlayersChange: (value: number[]) => void;
  onRefresh?: () => void;
  onReset: () => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: TSort) => void;
  onStatusChange: (value: TStatus) => void;
  onToggleSeats: () => void;
  search: string;
  sortBy: TSort;
  sortOptions: SelectOption<TSort>[];
  status: TStatus;
  statusOptions: SelectOption<TStatus>[];
};

export const GameFilters = <TStatus extends string, TSort extends string>({
  actionsSlot,
  hasSeats,
  isRefreshDisabled,
  maxPlayers,
  maxPlayersOptions,
  onMaxPlayersChange,
  onRefresh,
  onReset,
  onSearchChange,
  onSortChange,
  onStatusChange,
  onToggleSeats,
  search,
  sortBy,
  sortOptions,
  status,
  statusOptions,
}: GameFiltersProps<TStatus, TSort>) => {
  const handleSearchChange = (value: string) => {
    onSearchChange(value);
  };

  const handleStatusChange = (value: unknown) => {
    onStatusChange(value as TStatus);
  };

  const handleSortChange = (value: unknown) => {
    onSortChange(value as TSort);
  };

  const handleMaxPlayersChange = (value: unknown) => {
    onMaxPlayersChange(value as number[]);
  };

  const handleToggleSeats = () => {
    onToggleSeats();
  };

  const handleReset = () => {
    onReset();
  };

  const handleRefresh = () => {
    onRefresh?.();
  };

  return (
    <Flex align="center" direction="row" gap={12} wrap>
      <Input
        appearance="solid"
        placeholder="Поиск по названию"
        style={{ maxWidth: 260, minWidth: 200 }}
        value={search}
        onChange={event => handleSearchChange(event.target.value)}
      />
      <Select
        options={statusOptions}
        placeholder="Статус"
        style={{ height: 40, width: 200 }}
        value={status}
        onChange={handleStatusChange}
      />
      <Select
        options={sortOptions}
        placeholder="Сортировка"
        style={{ height: 40, width: 180 }}
        value={sortBy}
        onChange={handleSortChange}
      />
      <Select
        allowClear
        mode="multiple"
        options={maxPlayersOptions}
        placeholder="Макс. игроков"
        style={{ height: 40, minWidth: 160 }}
        value={maxPlayers}
        onChange={handleMaxPlayersChange}
      />
      <Button
        height={40}
        size="sm"
        variant={hasSeats ? 'accent' : 'outline'}
        onClick={handleToggleSeats}
      >
        Есть свободные места
      </Button>
      <Button
        height={40}
        size="sm"
        variant="outline"
        onClick={handleReset}
      >
        Сбросить фильтры
      </Button>
      {onRefresh && (
        <Button
          aria-label="Обновить список игр"
          disabled={isRefreshDisabled}
          height={40}
          minWidth={40}
          size="sm"
          title="Обновить"
          variant="outline"
          onClick={handleRefresh}
        >
          <ReloadOutlined />
        </Button>
      )}
      {actionsSlot}
    </Flex>
  );
};
