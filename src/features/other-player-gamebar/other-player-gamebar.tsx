import styled from "styled-components";

import { Card, Flex, Image, Typography } from "../../shared/ui/components";
import { HandCardIndicator } from "../hand-card-indicator";
import { getHandCardIndicator } from "../player-gamebar/heplers";
import { Profile } from "../profile";
import { Timer } from "../timer";

import { TCard } from "./types";

type TPlayerGameBarProps = {
  cards: TCard[];
  isCurrentTurn?: boolean;
  playerName?: null | string;
}

const IndicatorsGrid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing(2)};
  width: 100%;
`;

export const OtherPlayerGameBar = (props: TPlayerGameBarProps) => {
  const { cards = [], isCurrentTurn = false, playerName } = props;
  const displayName = playerName || 'Игрок';

  const getHandCardIndicators = (card: TCard, idx: number) => (
    <HandCardIndicator
      key={`${card.color}-${idx}`}
      count={card.count}
      indicator={getHandCardIndicator(card)}
      size="small"
    />
  );

  const gridColumns = Math.min(Math.max(cards.length || 3, 3), 5);

  return(
    <Flex gap={5} minWidth={300}>

      <Flex direction="row" justify="space-between">
        <Card animation='none' padding='sm' height={65} width={80}>
        <Flex align="center" justify="center" fullWidth fullHeight>
          { isCurrentTurn ? <Timer duration={40}/> : <Image variant="lockIcon" width={25}/>}
        </Flex>
        </Card>
        <Flex align="center" justify="center">
          <Profile/>
          <Typography.Text>{displayName}</Typography.Text>
        </Flex>

      </Flex>

      <Card animation='none' padding="sm" fullWidth>
        {cards.length === 0 ? (
          <Flex align="center">
            <Typography.Text tone="secondary">Карт нет</Typography.Text>
          </Flex>
        ) : (
          <IndicatorsGrid $columns={gridColumns}>
            {cards.map((card, idx) => getHandCardIndicators(card, idx))}
          </IndicatorsGrid>
        )}
      </Card>
    </Flex>
  );
};
