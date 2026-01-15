import { Modal } from 'antd';

import { Components } from '../../shared';
import type { TCard } from '../../store/api/types';

import { JokerColorOptions } from './constants';
import { Footer } from './footer';

const { Flex, Image, Select, Typography } = Components;

type JokerColorsModalProps = {
  error: null | string;
  isOpen: boolean;
  isSubmitting: boolean;
  jokerColorsByCardId: Record<number, number>;
  onChangeColor: (cardId: number, colorId: number) => void;
  onConfirm: () => void;
  unresolvedJokers: TCard[];
};

export const JokerColorsModal = ({
  error,
  isOpen,
  isSubmitting,
  jokerColorsByCardId,
  onChangeColor,
  onConfirm,
  unresolvedJokers,
}: JokerColorsModalProps) => {
  const footer = (
    <Footer
      confirmLabel="Подтвердить"
      isSubmitting={isSubmitting}
      onConfirm={onConfirm}
    />
  );

  return (
    <Modal
      centered
      closable={false}
      footer={footer}
      maskClosable={false}
      open={isOpen}
    >
      <Flex align='center' direction="column" gap={12}>
        <Typography.Text size="regular" tone='secondary' weight="medium">
          Выберите цвет для каждого джокера
        </Typography.Text>
        <Flex direction="column" gap={8}>
          {unresolvedJokers.map(joker => {
            const selectedColorId = jokerColorsByCardId[joker.cardId];
            const selectedIndicator = JokerColorOptions.find(option => option.colorId === selectedColorId)?.indicator;

            return (
              <Flex key={joker.cardId} align="center" direction="row" gap={100}>
                <Flex direction='row' gap={10}>
                  <Image height={29} variant="jokerIndicator" width={27} />
                  <Typography.Text size="medium" tone='secondary'>→</Typography.Text>
                  {selectedIndicator ? (
                    <Image height={29} variant={selectedIndicator} width={27} />
                  ) : (
                    <Flex height={29} style={{ border: '1px solid #424041', borderRadius: 6 }} width={27} />
                  )}
                </Flex>

                <Select
                  style={{ flex: 1, textAlign: 'center', width: 150 }}
                  placeholder="Выберите цвет"
                  value={selectedColorId ?? undefined}
                  options={JokerColorOptions.map(option => ({ label: option.label, value: option.colorId }))}
                  onChange={(value) => onChangeColor(joker.cardId, Number(value))}
                />
              </Flex>
            );
          })}
        </Flex>
        {error && (
          <Typography.Text tone="danger">{error}</Typography.Text>
        )}
      </Flex>
    </Modal>
  );
};
