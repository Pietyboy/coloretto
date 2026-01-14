import { Components } from '../../shared';

const { Button, Flex} = Components;

type TFooterProps = {
  isSubmitting: boolean;
  onCancel: () => void;
  onClick: () => void;
}

export const Footer = ({isSubmitting, onCancel, onClick}: TFooterProps) => {
    return(
      <Flex direction="row" justify="end" gap={3}>
        <Button type="button" variant="outlineSecondary" onClick={onCancel}>
          Отмена
        </Button>
        <Button
          type="button"
          variant="accent"
          disabled={isSubmitting}
          onClick={() => onClick()}
      >
          Создать
        </Button>
      </Flex>
    );
}