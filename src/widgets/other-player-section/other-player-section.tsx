import { OtherPlayerGameBar } from '../../features';
import { Components } from '../../shared';

import type { TOtherPlayer } from './types';

const { Flex } = Components;

type TOtherPlayerSectionProps = {
  isPaused: boolean;
  otherPlayers: TOtherPlayer[];
  serverNow?: null | number;
  turnEndsAt?: null | number;
  turnStartTime?: null | string;
  turnDuration: number;
};

export const OtherPlayerSection = ({
  isPaused,
  otherPlayers,
  serverNow,
  turnDuration,
  turnEndsAt,
  turnStartTime,
}: TOtherPlayerSectionProps) => (
  <Flex direction="row" fullWidth justify="space-evenly">
    {otherPlayers.map((player, index) => (
      <OtherPlayerGameBar
        key={player.playerId ?? index}
        cards={player.cards}
        isConnected={player.isConnected}
        isCurrentTurn={player.isCurrentTurn}
        isPaused={isPaused}
        playerName={player.playerName}
        serverNow={serverNow}
        turnEndsAt={turnEndsAt}
        turnStartTime={turnStartTime}
        turnDuration={turnDuration}
      />
    ))}
  </Flex>
);
