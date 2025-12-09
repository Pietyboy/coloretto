import styled from 'styled-components';

import { Components } from '../../shared';

const { Card } = Components;

export const ScoreCard = styled(Card)`
  flex: 1 1 320px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const ScoreTable = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${({ theme }) => theme.spacing(2)};
`;
