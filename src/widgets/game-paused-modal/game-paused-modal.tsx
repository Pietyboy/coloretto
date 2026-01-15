import { Modal } from 'antd';

import { Components } from '../../shared';

const { Flex, Image, Typography } = Components;

type GamePausedModalProps = {
  open: boolean;
};

export const GamePausedModal = ({ open }: GamePausedModalProps) => (
  <Modal centered closable={false} footer={null} maskClosable={false} open={open}>
    <Flex direction="column" gap={12}>
      <Flex align="center" direction="row" gap={8}>
        <Image variant="lockIcon" width={20} />
        <Typography.Text size="medium" tone="secondary" weight="semibold">
          Игра на паузе
        </Typography.Text>
      </Flex>
      <Typography.Text tone="secondary">
        Хост поставил игру на паузу. Ожидайте, пока он продолжит игру.
      </Typography.Text>
    </Flex>
  </Modal>
);

