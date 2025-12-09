import { Components } from '../../shared';

import { LobbyCard } from './lobby-section.styled';

const { Button, Flex, Typography } = Components;
const { Heading, Text } = Typography;

export const LobbySection = () => (
  <LobbyCard padding="lg" elevation={1}>
    <Flex gap={3}>
      <Heading level={3}>Активные комнаты</Heading>
      <Text>
        Видны только публичные столы. Частные комнаты доступны по коду приглашения.
      </Text>
      <Flex gap={2}>
        <Text>
          <strong>Стол #4132</strong> · 3 / 5 игроков
        </Text>
        <Text>
          <strong>Стол #9271</strong> · 4 / 5 игроков
        </Text>
        <Text>Подождите обновления списка...</Text>
      </Flex>
      <Button variant="secondary">Обновить</Button>
    </Flex>
  </LobbyCard>
);
