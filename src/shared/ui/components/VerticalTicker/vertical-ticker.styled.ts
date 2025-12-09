import styled from 'styled-components';

export const TickerContainer = styled.div<{ $height: string; $width: string; $maxWidth?: string }>`
  overflow: hidden;
  width: ${({ $width }) => $width};
  max-width: ${({ $maxWidth }) => $maxWidth || 'none'};
  height: ${({ $height }) => $height};
  position: relative;
`;

export const TickerTrack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;
