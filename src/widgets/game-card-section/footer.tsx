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
      <Button type="button" variant="outlineSecondary" onClick={onCancel}>
        {cancelLabel}
      </Button>
    ) : null}
    <Button type="button" variant="accent" disabled={isSubmitting} onClick={onConfirm}>
      {confirmLabel}
    </Button>
  </Flex>
);
