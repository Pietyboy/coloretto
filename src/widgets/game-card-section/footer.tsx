import { Components } from '../../shared';

const { Button, Flex } = Components;

type FooterProps = {
  cancelLabel?: string;
  confirmLabel: string;
  isSubmitting: boolean;
  onCancel?: () => void;
  onConfirm: () => void;
};

export const Footer = ({
  cancelLabel,
  confirmLabel,
  isSubmitting,
  onCancel,
  onConfirm,
}: FooterProps) => (
  <Flex direction="row" justify="end" gap={3}>
    {onCancel && cancelLabel ? (
      <Button height={30} onClick={onCancel} type="button" variant="outlineSecondary">
        {cancelLabel}
      </Button>
    ) : null}
    <Button disabled={isSubmitting} height={30} onClick={onConfirm} type="button" variant="accent">
      {confirmLabel}
    </Button>
  </Flex>
);
