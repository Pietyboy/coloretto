import { Components } from '../../shared';

import { AccentRing, HeroCard } from './hero-section.styled';

const { Button, Flex, Typography } = Components;
const { Heading, Text } = Typography;
export const HeroSection = () => (
  <HeroCard variant="glass" padding="lg" elevation={2}>
    <AccentRing />
    <Flex gap={4}>
      <Text>
        Встречайте Coloretto Online
      </Text>
      <Heading level={1}>Создайте комнату и позовите друзей</Heading>
      <Text>
        Пошаговая игра Колоретто на 3–5 игроков. Собирайте наборы цветов, рассчитывайте риски и
        побеждайте в сезонах.
      </Text>
      <Flex direction="row" gap={3}>
        <Button size="lg">Создать комнату</Button>
        <Button size="lg" variant="ghost">
          Присоединиться
        </Button>
      </Flex>
    </Flex>
  </HeroCard>
);
