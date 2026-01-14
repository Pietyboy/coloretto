import type { FormInstance } from 'antd';
import { Modal } from 'antd';

import { Components } from '../../shared';

import { Footer } from './footer';
import type { CreateGameFormValues, SelectOption } from './types';

const { Form, Input, Select, Typography } = Components;

type CreateGameModalProps = {
  error: null | string;
  form: FormInstance<CreateGameFormValues>;
  isOpen: boolean;
  isSubmitting: boolean;
  maxSeatsOptions: SelectOption<number>[];
  onCancel: () => void;
  onFinish: (values: CreateGameFormValues) => void;
  onValuesChange: () => void;
  turnTimeOptions: SelectOption<number>[];
};

export const CreateGameModal = ({
  error,
  form,
  isOpen,
  isSubmitting,
  maxSeatsOptions,
  onCancel,
  onFinish,
  onValuesChange,
  turnTimeOptions,
}: CreateGameModalProps) => {

  return (
    <Modal
      centered
      footer={<Footer isSubmitting={isSubmitting} onCancel={onCancel} onClick={form.submit}/>}
      open={isOpen}
      onCancel={onCancel}
    >
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Создать игру
      </Typography.Title>
      <Form<CreateGameFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        {error ? (
          <Form.Item style={{ marginBottom: 16 }}>
            <Typography.Text tone="danger">{error}</Typography.Text>
          </Form.Item>
        ) : null}
        <Form.Item
          label="Название игры"
          name="gameName"
          rules={[{ message: 'Введите название игры', required: true }]}
        >
          <Input appearance="ghostDark" placeholder="Название" />
        </Form.Item>
        <Form.Item
          label="Количество игроков"
          name="maxSeatsCount"
          rules={[{ message: 'Выберите количество игроков', required: true }]}
        >
          <Select
            options={maxSeatsOptions}
            placeholder="3-5"
          />
        </Form.Item>
        <Form.Item
          label="Время на ход (сек)"
          name="turnTime"
          rules={[{ message: 'Выберите время на ход', required: true }]}
        >
          <Select
            options={turnTimeOptions}
            placeholder="20-60"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
