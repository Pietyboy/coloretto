import { Modal } from 'antd';

import { Components } from '../../shared';

const { Flex, Typography } = Components;

type GameFinishWaitingModalProps = {
  open: boolean;
};

export const GameFinishWaitingModal = ({ open }: GameFinishWaitingModalProps) => {
  return (
    <Modal
      centered
      closable={false}
      footer={null}
      maskClosable={false}
      open={open}
    >
      <Flex direction="column" gap={12}>
        <Typography.Text size="medium" tone="secondary" weight="semibold">
          Ожидаем остальных игроков
        </Typography.Text>
        <Typography.Text tone="secondary">
          Другие игроки выбирают цвета для джокеров и/или цвета для подсчёта очков.
        </Typography.Text>
      </Flex>
    </Modal>
  );
};

