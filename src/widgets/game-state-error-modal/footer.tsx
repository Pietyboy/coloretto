import { Components } from '../../shared';

const { Button, Flex } = Components;

type FooterProps = {
  onClick: () => void;
};

export const Footer = ({ onClick }: FooterProps) => (
  <Flex direction="row" justify="end">
    <Button size="md" variant="accent" onClick={onClick}>
      К списку игр
    </Button>
  </Flex>
);

