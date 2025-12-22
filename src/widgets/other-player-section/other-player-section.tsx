import { OtherPlayerGameBar } from '../../features';
import { Components } from '../../shared';

import type { TOtherPlayer } from './types';

const { Flex } = Components;

type TOtherPlayerSectionProps = {
  isPaused: boolean;
  otherPlayers: TOtherPlayer[];
  turnDuration: number;
};

export const OtherPlayerSection = ({ isPaused, otherPlayers, turnDuration }: TOtherPlayerSectionProps) => (
  <Flex direction="row" justify="space-evenly">
    {otherPlayers.map((player, index) => (
      <OtherPlayerGameBar
        key={player.playerId ?? index}
        cards={player.cards}
        isCurrentTurn={player.isCurrentTurn}
        isPaused={isPaused}
        playerName={player.playerName}
        turnDuration={turnDuration}
      />
    ))}
  </Flex>
);
