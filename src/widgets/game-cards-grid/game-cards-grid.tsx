import type { ReactNode } from 'react';

import { Components } from '../../shared';

const { Empty, Flex, Spin } = Components;

type GameCardsGridProps<T> = {
  emptyText?: string;
  isLoading: boolean;
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
};

export const GameCardsGrid = <T,>({
  emptyText,
  isLoading,
  items,
  renderItem,
}: GameCardsGridProps<T>) => {
  const hasItems = items.length > 0;
  console.log(items);

  return (
    <Flex direction="row" fullWidth gap={20} style={{ minHeight: 200, position: 'relative' }} wrap>
      {isLoading ? (
        <Flex align="center" fullHeight fullWidth justify="center">
          <Spin size="large" />
        </Flex>
      ) : hasItems ? (
        items.map((item, index) => renderItem(item, index))
      ) : (
        <Flex align="center" fullHeight fullWidth justify="center">
          <Empty message={emptyText ?? 'Ничего не найдено'} />
        </Flex>
      )}
    </Flex>
  );
};
