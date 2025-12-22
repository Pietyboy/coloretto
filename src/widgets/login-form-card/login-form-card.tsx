import type { FormInstance } from 'antd';
import { Alert, Spin } from 'antd';

import { Components } from '../../shared';

const { Button, Card, Flex, Form, Input } = Components;

type LoginFormCardProps = {
  error: null | string;
  form: FormInstance;
  isLoading: boolean;
  isRegisterMode: boolean;
  onFinish: (values: { confirmPassword?: string; password: string; username: string }) => void;
  onToggleMode: () => void;
};

export const LoginFormCard = ({
  error,
  form,
  isLoading,
  isRegisterMode,
  onFinish,
  onToggleMode,
}: LoginFormCardProps) => (
  <Card animation="none" width="30%">
    <Spin spinning={isLoading}>
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={onFinish}
      >
        <Flex direction="column" fullHeight gap={12} justify="space-between">
          <Flex gap={10}>
            <Form.Item
              label="Имя"
              name="username"
              rules={[{ message: 'Введите имя', required: true }]}
            >
              <Input appearance="ghostDark" placeholder="Имя" />
            </Form.Item>
            <Form.Item
              label="Пароль"
              name="password"
              rules={[{ message: 'Введите пароль', required: true }]}
            >
              <Input.Password appearance="ghostDark" placeholder="Пароль" width="auto" />
            </Form.Item>
            {isRegisterMode && (
              <Form.Item
                dependencies={['password']}
                label="Подтверждение пароля"
                name="confirmPassword"
                rules={[
                  { message: 'Подтвердите пароль', required: true },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Пароли не совпадают'));
                    },
                  }),
                ]}
              >
                <Input.Password appearance="ghost" placeholder="Повторите пароль" />
              </Form.Item>
            )}
          </Flex>
          {error && <Alert message={error} showIcon type="error" />}
          <Flex gap={10}>
            <Button
              buttonRadii="sm"
              fullWidth
              type="submit"
              variant="accent"
            >
              {isRegisterMode ? 'Зарегистрироваться' : 'Войти'}
            </Button>
          </Flex>
          <Button
            buttonRadii="sm"
            fullWidth
            size="sm"
            variant="outlineSecondary"
            onClick={onToggleMode}
          >
            {isRegisterMode ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </Button>
        </Flex>
      </Form>
    </Spin>
  </Card>
);
