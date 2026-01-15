import { Modal } from 'antd';
import { useNavigate } from 'react-router';

import { Components } from '../../shared';
import { removeActiveGame } from '../../shared/lib/active-games';

import { Footer } from './footer';

const { Flex, Typography } = Components;

type GameStateErrorModalProps = {
  gameId: number;
  message: string;
  open: boolean;
};

export const GameStateErrorModal = ({ gameId, message, open }: GameStateErrorModalProps) => {
  const navigate = useNavigate();

  const handleBackToGames = () => {
    removeActiveGame(gameId);
    navigate('/');
  };

  return (
    <Modal
      centered
      closable={false}
      footer={<Footer onClick={handleBackToGames} />}
      maskClosable={false}
      open={open}
    >
      <Flex direction="column" gap={12}>
        <Typography.Text size="medium" tone="secondary" weight="semibold">
          Произошла ошибка
        </Typography.Text>
        <Typography.Text style={{ whiteSpace: 'pre-wrap' }} tone="secondary">
          {message}
        </Typography.Text>
      </Flex>
    </Modal>
  );
};

