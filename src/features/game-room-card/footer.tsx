import { Components } from '../../shared';

const { Button, Flex } = Components;

type FooterProps = {
  isSubmitting: boolean;
  onCancel: () => void;
  onClick: () => void;
};

export const Footer = ({ isSubmitting, onCancel, onClick }: FooterProps) => (
  <Flex direction="row" justify="end" gap={3}>
    <Button type="button" variant="outlineSecondary" onClick={onCancel}>
      Отмена
    </Button>
    <Button type="button" variant="accent" disabled={isSubmitting} onClick={onClick}>
      Подключиться
    </Button>
  </Flex>
);
