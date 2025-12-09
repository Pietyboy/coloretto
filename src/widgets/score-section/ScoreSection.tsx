import { Fragment } from 'react';

import { Components } from '../../shared';

import { ScoreCard, ScoreTable } from './score-section.styled';

const sampleScores = [
  { player: 'Алиса', score: 24 },
  { player: 'Борис', score: 18 },
  { player: 'Кира', score: 12 },
];

const { Button, Flex, Typography } = Components;
const { Heading } = Typography;

export const ScoreSection = () => (
  <ScoreCard padding="lg" elevation={1}>
    <Flex gap={2}>
      <Heading level={3}>Последняя партия</Heading>
      <Typography.Text>Сезон 12 · 31 октября</Typography.Text>
    </Flex>
    <ScoreTable>
      {sampleScores.map(({ player, score }) => (
        <Fragment key={player}>
          <Typography.Text>{player}</Typography.Text>
          <Typography.Text>
            {score} очков
          </Typography.Text>
        </Fragment>
      ))}
    </ScoreTable>
    <Button variant="ghost">Смотреть историю игр</Button>
  </ScoreCard>
);
