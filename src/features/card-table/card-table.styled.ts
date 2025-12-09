import styled from 'styled-components';

export const CARD_WIDTH = 139;
export const CARD_HEIGHT = 195;

type SlotSizeProps = {
  $height?: number;
  $width?: number;
};

export const BaseSlot = styled.div<SlotSizeProps>`
  width: ${({ $width = CARD_WIDTH }) => `${$width}px`};
  height: ${({ $height = CARD_HEIGHT }) => `${$height}px`};
  min-width: ${CARD_WIDTH}px;
  min-height: ${CARD_HEIGHT}px;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EmptySlot = styled(BaseSlot)`
  border: 2px dashed #222222;
  background: transparent;
`;

export const StackSlot = styled(BaseSlot)`
  position: relative;
  border: none;
`;

export const StackCard = styled.div<{
  $height: number;
  $offset: number;
  $width: number;
}>`
  position: absolute;
  top: ${({ $offset }) => `${$offset}px`};
  left: ${({ $offset }) => `${$offset}px`};
  width: ${({ $width }) => `${$width}px`};
  height: ${({ $height }) => `${$height}px`};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
`;
