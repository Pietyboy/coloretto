import type { DragEvent } from "react";

import styled from "styled-components";

import { Components } from "../../shared";
import { ImageVariant } from "../../shared/ui/components/Image/types";
import { CardTable } from "../card-table";

import { gugiFontStyle } from "./constants";

const {Flex, Image, Typography} = Components;
const {Text} = Typography;

const RowContainer = styled(Flex)<{ $droppable: boolean; $active: boolean; $clickable: boolean }>`
  border: ${({ $active, $droppable, theme }) => {
    if ($active) return `2px solid ${theme.colors.accent}`;
    if ($droppable) return `1px dashed ${theme.colors.surfaceMuted}`;
    return '1px solid transparent';
  }};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing(1)};
  transition: border ${({ theme }) => theme.transitions.base}, box-shadow ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ $active, theme }) => ($active ? `0 0 0 2px ${theme.colors.accent}33` : 'none')};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

export type CardRowProps = {
  cards?: ImageVariant[];
  count?: number;
  isRow?: boolean;
  isDroppable?: boolean;
  isActiveDrop?: boolean;
  onDropCard?: (rowId: number) => void;
  onDragEnterRow?: (rowId: number) => void;
  onDragLeaveRow?: (rowId: number) => void;
  onClickRow?: (rowId: number) => void;
  disableClick?: boolean;
  rowId: number;
  isActive?: boolean;
};

export const CardRow = ({
  cards = [],
  count,
  disableClick = false,
  isActive = true,
  isActiveDrop = false,
  isDroppable = false,
  isRow = true,
  onClickRow,
  onDragEnterRow,
  onDragLeaveRow,
  onDropCard,
  rowId,
}: CardRowProps) => {

    const indicatorVariants = cards.map(card => {
      if (card === 'plusTwoCard') return 'plusTwoDarkIndicator';
      if (card === 'jokerCard') return 'jokerIndicator';
      if (card.endsWith('Card')) {
        return (card.replace('Card', 'Indicator'));
      }
      return card;
    });

    const handleDragOver = (event: DragEvent) => {
      if (!isDroppable) return;
      event.preventDefault();
    };

    const handleDrop = (event: DragEvent) => {
      if (!isDroppable) return;
      event.preventDefault();
      onDropCard?.(rowId);
    };

    const handleDragEnter = () => {
      if (!isDroppable) return;
      onDragEnterRow?.(rowId);
    };

    const handleDragLeave = () => {
      if (!isDroppable) return;
      onDragLeaveRow?.(rowId);
    };

    const handleClick = () => {
      if (disableClick) return;
      onClickRow?.(rowId);
    };

    if (!isActive) return null;

    return (
    <RowContainer
      $active={isActiveDrop}
      $droppable={isDroppable}
      $clickable={!!onClickRow && !disableClick}
      justify="space-between"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
        <CardTable count={cards.length} offset={10} topCard={cards[cards.length-1]}/>
        {isRow ? (
          <Flex align="center" direction="row" gap={5} justify="center">
            {indicatorVariants.map((indicator, idx) => (
              <Image key={`${indicator}-${idx}`} variant={indicator}/>
            ))}
          </Flex>
        ) : (
          <Flex align="center" direction="row" gap={5} justify="center">
            <Text style={gugiFontStyle} size="large">
              {count}
            </Text>
          </Flex>
        )}
    </RowContainer>

    );
}
