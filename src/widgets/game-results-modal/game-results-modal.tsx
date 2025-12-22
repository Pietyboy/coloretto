import { Modal } from 'antd';
import { useNavigate } from 'react-router';

import { Components } from '../../shared';
import { useGetGameScoresQuery } from '../../store/api/game-api';

import { normalizeGameScores } from './helpers';

const { Button, Flex, Typography } = Components;

type GameResultsModalProps = {
  gameId: number;
  open: boolean;
};

export const GameResultsModal = ({ gameId, open }: GameResultsModalProps) => {
  const navigate = useNavigate();

  const { data: gameScoresData, isFetching: isFetchingGameScores } = useGetGameScoresQuery(gameId, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
    skip: !gameId || !open,
  });

  const scoreRows = normalizeGameScores(gameScoresData?.scores);

  return (
    <Modal
      centered
      closable={false}
      footer={(
        <Button size="md" variant="primary" onClick={() => navigate('/')}>
          К списку игр
        </Button>
      )}
      maskClosable={false}
      open={open}
    >
      <Flex direction="column" gap={12}>
        <Typography.Text size="medium" weight="semibold">
          Итоги игры
        </Typography.Text>
        {isFetchingGameScores && (
          <Typography.Text tone="secondary">Получаем таблицу результатов...</Typography.Text>
        )}
        {!isFetchingGameScores && scoreRows.length === 0 && (
          <Typography.Text tone="secondary">Не удалось получить таблицу результатов</Typography.Text>
        )}
        {scoreRows.length > 0 && (
          <Flex direction="column" gap={8}>
            <Flex direction="row" gap={12}>
              <Flex style={{ width: 36 }}>
                <Typography.Text tone="secondary">#</Typography.Text>
              </Flex>
              <Flex style={{ flex: 1, minWidth: 0 }}>
                <Typography.Text tone="secondary">Игрок</Typography.Text>
              </Flex>
              <Flex justify="end" style={{ width: 80 }}>
                <Typography.Text tone="secondary">Очки</Typography.Text>
              </Flex>
            </Flex>
            {scoreRows.map((row, index) => (
              <Flex key={row.playerId ?? index} direction="row" gap={12}>
                <Flex style={{ width: 36 }}>
                  <Typography.Text>{index + 1}</Typography.Text>
                </Flex>
                <Flex style={{ flex: 1, minWidth: 0 }}>
                  <Typography.Text ellipsis>{row.nickname}</Typography.Text>
                </Flex>
                <Flex justify="end" style={{ width: 80 }}>
                  <Typography.Text>{row.score}</Typography.Text>
                </Flex>
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>
    </Modal>
  );
};

