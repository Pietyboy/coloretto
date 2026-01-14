import { useState } from 'react';

import { useNavigate } from 'react-router';

import { useNotify } from '../../hooks/useNotify';
import { Components } from '../../shared';
import { setStoredAuth } from '../../shared/lib/auth-storage';
import { useLoginMutation, useRegisterMutation } from '../../store/api/auth-api';
import { useAppDispatch } from '../../store/hooks';
import { setAuthToken, setUsername } from '../../store/slices/profile-slice';
import { LoginAside, LoginFormCard } from '../../widgets';

import { getAuthErrorMessage } from './helpers';
import type { AuthMode, LoginFormValues } from './types';

const { Flex, Form } = Components;

export const LoginPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<null | string>(null);

  const dispatch = useAppDispatch();
  const notify = useNotify();
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginFormValues>();

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const isLoading = isLoginLoading || isRegisterLoading;
  const isRegisterMode = mode === 'register';

  const handleSwitchMode = () => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'));
    setError(null);
    form.resetFields();
  };

  const handleFinish = async (values: LoginFormValues) => {
    try {
      setError(null);
      const payload = { password: values.password, username: values.username };
      const action = isRegisterMode ? register : login;
      const data = await action(payload).unwrap();
      const accessToken = data?.accessToken ?? data?.token;

      if (!accessToken) {
        throw new Error('Не удалось получить токен');
      }

      dispatch(setAuthToken(accessToken));
      dispatch(setUsername(data?.username ?? values.username));
      setStoredAuth(accessToken, data?.username ?? values.username);
      navigate('/', { replace: true });
    } catch (e) {
      console.log(e);
      const message = getAuthErrorMessage(e);
      setError(message);
      notify('error', message);
    }
  };

  return (
    <Flex direction="row" fullWidth fullHeight>
      <Flex align="center" justify="center" height="100vh" fullWidth>
        <LoginFormCard
          error={error}
          form={form}
          isLoading={isLoading}
          isRegisterMode={isRegisterMode}
          onFinish={handleFinish}
          onToggleMode={handleSwitchMode}
        />
      </Flex>
      <LoginAside />
    </Flex>
  );
};
