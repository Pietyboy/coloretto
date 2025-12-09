import { useState } from "react";

import { Alert, message, Spin } from "antd";
import { useLocation, useNavigate } from "react-router";

import { VerticalTickers } from "../../features/vertical-tickers";
import { Components } from "../../shared";
import { useLoginMutation, useRegisterMutation } from "../../store/api/auth-api";
import { useAppDispatch } from "../../store/hooks";
import { setAuthToken, setUsername } from "../../store/slices/profile-slice";

const { Button, Card, Flex, Form, Input } = Components;

type LoginFormValues = {
  username: string;
  password: string;
  confirmPassword?: string;
};

export const LoginPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<null | string>(null);
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as null | { from?: { pathname?: string } })?.from?.pathname || "/";
  const [form] = Form.useForm<LoginFormValues>();
  const isLoading = isLoginLoading || isRegisterLoading;

  const handleSwitchMode = () => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'));
    setError(null);
    form.resetFields();
  };

  const handleFinish = async (values: LoginFormValues) => {
    try{
      setError(null);
      const payload = { password: values.password, username: values.username };
      const action = mode === 'login' ? login : register;
      const data = await action(payload).unwrap();
      const accessToken = data?.accessToken ?? data?.token;

      if (!accessToken) {
        throw new Error("Не удалось получить токен");
      }

      dispatch(setAuthToken(accessToken));
      dispatch(setUsername(data?.username ?? values.username));
      navigate(from);
    } catch (e) {
      console.log(e);
      const apiMessage = (e as { data?: { error?: string; message?: string }; message?: string })?.data?.error
        || (e as { data?: { message?: string } }).data?.message
        || (e as { message?: string }).message
        || "Не удалось выполнить запрос. Проверьте данные и попробуйте снова.";
      setError(apiMessage);
      message.error(apiMessage);
    }
  };

  return (
    <Flex direction="row" fullWidth fullHeight>
      <Flex align="center" justify="center" height="100vh" fullWidth>
        <Card animation="none" width="30%">
        <Spin spinning={isLoading}>
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleFinish}
          >
            <Flex direction="column" fullHeight gap={12} justify="space-between">
              <Flex gap={10}>
                <Form.Item
                  name="username"
                  label="Имя"
                  rules={[{ message: "Введите имя", required: true }]}
                >
                  <Input appearance="ghostDark" placeholder="Имя" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Пароль"
                  rules={[{ message: "Введите пароль", required: true }]}
                >
                  <Input.Password appearance="ghostDark" placeholder="Пароль" width="auto"/>
                </Form.Item>
                {mode === 'register' && (
                  <Form.Item
                    name="confirmPassword"
                    label="Подтверждение пароля"
                    dependencies={['password']}
                    rules={[
                      { message: "Подтвердите пароль", required: true },
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
              {error && <Alert message={error} type="error" showIcon />}
              <Flex gap={10}>
                <Button
                  buttonRadii="sm"
                  type="submit"
                  variant="accent"
                  fullWidth
                >
                  {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                </Button>
              </Flex>
              <Button
                buttonRadii="sm"
                variant="outlineSecondary"
                size="sm"
                fullWidth
                onClick={handleSwitchMode}
              >
                {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
              </Button>
            </Flex>
          </Form>
          </Spin>
        </Card>
      </Flex>
      <VerticalTickers />
    </Flex>
  );
};
