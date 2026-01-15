import { Modal } from 'antd';

import { Components } from '../../shared';

import { JokerColorOptions } from './constants';
import { Footer } from './footer';

const { Flex, Image, Select, Typography } = Components;

type ScoreColorsModalProps = {
  error: null | string;
  isOpen: boolean;
  isSubmitting: boolean;
  onChangeColor: (index: number, colorId: number) => void;
  onConfirm: () => void;
  scoreColorIds: Array<null | number>;
};

export const ScoreColorsModal = ({
  error,
  isOpen,
  isSubmitting,
  onChangeColor,
  onConfirm,
  scoreColorIds,
}: ScoreColorsModalProps) => {
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
      <Flex direction="column" gap={12}>
        <Typography.Text size="regular" tone="secondary" weight="medium">
          Выберите 3 цвета для подсчёта очков
        </Typography.Text>
        <Typography.Text tone="secondary">
          Эти 3 цвета будут приносить положительные очки, все остальные — отрицательные.
        </Typography.Text>
        <Flex align='center' direction="column" gap={8}>
          {[0, 1, 2].map(index => {
            const selectedColorId = scoreColorIds[index];
            const selectedIndicator = JokerColorOptions.find(option => option.colorId === selectedColorId)?.indicator;
            const selectedOther = scoreColorIds.filter((value, idx) =>
              idx !== index && typeof value === 'number'
            ) as number[];

            return (
              <Flex key={index} align="center" direction="row" gap={100}>
                {selectedIndicator ? (
                  <Image height={29} variant={selectedIndicator} width={27} />
                ) : (
                  <Image height={29} variant='noColorIndicator' width={27} />
                )}
                <Select
                  style={{ flex: 1, textAlign: 'center', width: 150 }}
                  placeholder={`Цвет ${index + 1}`}
                  value={selectedColorId ?? undefined}
                  options={JokerColorOptions.map(option => ({
                    disabled: selectedOther.includes(option.colorId),
                    label: option.label,
                    value: option.colorId,
                  }))}
                  onChange={(value) => onChangeColor(index, Number(value))}
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
