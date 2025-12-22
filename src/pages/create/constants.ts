import type { SortFilter, StatusFilter } from './types';

export const maxSeatsOptions = [3, 4, 5];
export const maxSeatsSelectOptions = maxSeatsOptions.map(value => ({
  label: value.toString(),
  value,
}));

export const turnTimeOptions = [20, 30, 40, 50, 60];
export const turnTimeSelectOptions = turnTimeOptions.map(value => ({
  label: value.toString(),
  value,
}));

export const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: 'Все', value: 'all' },
  { label: 'Ожидают игроков', value: 'waiting' },
  { label: 'В процессе', value: 'in-progress' },
  { label: 'Завершённые', value: 'finished' },
];

export const sortOptions: Array<{ label: string; value: SortFilter }> = [
  { label: 'Сначала новые', value: 'newest' },
  { label: 'Сначала старые', value: 'oldest' },
  { label: 'По алфавиту', value: 'alpha' },
];
