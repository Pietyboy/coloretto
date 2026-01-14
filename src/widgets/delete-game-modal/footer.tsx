import { Components } from '../../shared';

const { Button, Flex } = Components;

type FooterProps = {
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const Footer = ({ isSubmitting, onCancel, onConfirm }: FooterProps) => (
  <Flex direction="row" justify="end" gap={3}>
    <Button type="button" variant="outlineSecondary" onClick={onCancel}>
      Отмена
    </Button>
    <Button type="button" variant="danger" disabled={isSubmitting} onClick={onConfirm}>
      Удалить
    </Button>
  </Flex>
);
