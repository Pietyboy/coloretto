import type { ReactNode } from 'react';

import { Components } from '../../shared';

import type { SelectOption } from './types';

const { Button, Flex, Input, Select } = Components;

type GameFiltersProps<TStatus extends string, TSort extends string> = {
  actionsSlot?: ReactNode;
  hasSeats: boolean;
  maxPlayers: number[];
  maxPlayersOptions: SelectOption<number>[];
  onMaxPlayersChange: (value: number[]) => void;
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
  maxPlayers,
  maxPlayersOptions,
  onMaxPlayersChange,
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
}: GameFiltersProps<TStatus, TSort>) => (
  <Flex align="center" direction="row" gap={12} wrap>
    <Input
      appearance="solid"
      placeholder="Поиск по названию"
      style={{ maxWidth: 260, minWidth: 200 }}
      value={search}
      onChange={event => onSearchChange(event.target.value)}
    />
    <Select
      options={statusOptions}
      placeholder="Статус"
      style={{ height: 40, width: 200 }}
      value={status}
      onChange={value => onStatusChange(value as TStatus)}
    />
    <Select
      options={sortOptions}
      placeholder="Сортировка"
      style={{ height: 40, width: 180 }}
      value={sortBy}
      onChange={value => onSortChange(value as TSort)}
    />
    <Select
      allowClear
      mode="multiple"
      options={maxPlayersOptions}
      placeholder="Макс. игроков"
      style={{ height: 40, minWidth: 160 }}
      value={maxPlayers}
      onChange={value => onMaxPlayersChange(value as number[])}
    />
    <Button
      height={40}
      size="sm"
      variant={hasSeats ? 'accent' : 'outline'}
      onClick={onToggleSeats}
    >
      Есть свободные места
    </Button>
    <Button
      height={40}
      size="sm"
      variant="outline"
      onClick={onReset}
    >
      Сбросить фильтры
    </Button>
    {actionsSlot}
  </Flex>
);
