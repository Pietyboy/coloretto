import { Modal } from 'antd';

import { Components } from '../../shared';

import { Footer } from './footer';

const { Typography } = Components;

type TakeRowModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const TakeRowModal = ({
  isOpen,
  isSubmitting,
  onCancel,
  onConfirm,
}: TakeRowModalProps) => (
  <Modal
    centered
    footer={(
      <Footer
        cancelLabel="Нет"
        confirmLabel="Да"
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    )}
    open={isOpen}
    onCancel={onCancel}
  >
    <Typography.Text tone={'secondary'}>Вы точно хотите взять этот ряд?</Typography.Text>
  </Modal>
);
