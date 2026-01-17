import type { FormInstance } from 'antd';
import { Modal } from 'antd';

import { Components } from '../../shared';

import { Footer } from './footer';
import type { CreatePlayerFormValues } from './types';

const { Form, Input, Typography } = Components;

type CreatePlayerModalProps = {
  error: null | string;
  form: FormInstance<CreatePlayerFormValues>;
  isOpen: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onFinish: (values: CreatePlayerFormValues) => void;
  onValuesChange: () => void;
};

export const CreatePlayerModal = ({
  error,
  form,
  isOpen,
  isSubmitting,
  onCancel,
  onFinish,
  onValuesChange,
}: CreatePlayerModalProps) => {
  const footer = (
    <Footer
      isSubmitting={isSubmitting}
      onCancel={onCancel}
      onClick={form.submit}
    />
  );

  return (
    <Modal
      centered
      footer={footer}
      open={isOpen}
      title="Создать игрока"
      onCancel={onCancel}
    >
      <Form<CreatePlayerFormValues>
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
          label="Никнейм"
          name="nickname"
          rules={[{ message: 'Введите никнейм', required: true, whitespace: true }]}
        >
          <Input appearance="ghostDark" placeholder="Ваш никнейм" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
