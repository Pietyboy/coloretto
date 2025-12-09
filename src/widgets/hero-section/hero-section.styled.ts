import styled from 'styled-components';

import { Components } from '../../shared';
const { Card } = Components;

export const HeroCard = styled(Card)`
  overflow: hidden;
  isolation: isolate;
`;

export const AccentRing = styled.div`
  position: absolute;
  inset: -120px;
  background: radial-gradient(
    circle,
    rgba(129, 68, 146, 0.35) 0%,
    rgba(66, 64, 65, 0.15) 60%,
    rgba(34, 34, 34, 0.1) 100%
  );
  filter: blur(0.5px);
`;
