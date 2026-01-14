import { Modal } from 'antd';

import { Components } from '../../shared';

import { Footer } from './footer';

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
    footer={<Footer isSubmitting={isLoading} onCancel={onCancel} onConfirm={onConfirm} />}
    open={isOpen}
    title="Удалить игру"
    onCancel={onCancel}
  >
    <Typography.Text>Вы точно хотите удалить эту игру?</Typography.Text>
  </Modal>
);
