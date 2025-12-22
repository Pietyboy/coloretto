import { Modal } from 'antd';

import { Components } from '../../shared';

const { Typography } = Components;

type DeleteGameModalProps = {
  isLoading: boolean;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const DeleteGameModal = ({
  isLoading,
  isOpen,
  onCancel,
  onConfirm,
}: DeleteGameModalProps) => (
  <Modal
    centered
    cancelText="Отмена"
    confirmLoading={isLoading}
    okButtonProps={{ danger: true }}
    okText="Удалить"
    open={isOpen}
    title="Удалить игру"
    onCancel={onCancel}
    onOk={onConfirm}
  >
    <Typography.Text>Вы точно хотите удалить эту игру?</Typography.Text>
  </Modal>
);
