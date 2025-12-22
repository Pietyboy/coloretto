import { Components } from '../../shared';

import { CARD_HEIGHT, CARD_WIDTH } from './constants';

const { Card, Flex, Image } = Components;

export type GameCardProps = {
  animation?: 'default' | 'none' | 'parallax' | 'tilt';
  height?: number;
  variant: string;
  width?: number;
};

export const GameCard = ({
  animation = 'parallax',
  height = CARD_HEIGHT,
  variant,
  width = CARD_WIDTH,
}: GameCardProps) => (
  <Flex align='center' justify='center'>
    <Card animation={animation} height={height} padding="none" width={width} overflow>
      <Image height={height} variant={variant} width={width} />
    </Card>
  </Flex>
);
