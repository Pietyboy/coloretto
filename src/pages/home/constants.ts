import type { SortFilter, StatusFilter } from './types';

export const maxPlayersOptions = [3, 4, 5];
export const maxPlayersSelectOptions = maxPlayersOptions.map(value => ({
  label: value.toString(),
  value,
}));

export const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: 'Все', value: 'all' },
  { label: 'В игре', value: 'in-progress' },
  { label: 'Завершены', value: 'finished' },
];

export const sortOptions: Array<{ label: string; value: SortFilter }> = [
  { label: 'Сначала новые', value: 'newest' },
  { label: 'Сначала старые', value: 'oldest' },
  { label: 'По алфавиту', value: 'alpha' },
];
