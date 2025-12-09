import { useState } from 'react';

import { message } from 'antd';
import { useNavigate } from 'react-router';

import { Components } from '../../shared';
import { Page } from '../../shared/ui/components';
import { useCreateGameMutation, useJoinGameMutation } from '../../store/api/game-api';

const { Button, Card, Flex, Form, Input, Select, Typography } = Components;

type CreateGameFormValues = {
  gameName: string;
  maxSeatsCount: number;
  turnTime: number;
};

type JoinFormValues = {
  nickname: string;
};

const maxSeatsOptions = [3, 4, 5];
const turnTimeOptions = [20, 30, 40, 50, 60];

export const CreateGamePage = () => {
  const [createGame, { isLoading: isCreating }] = useCreateGameMutation();
  const [joinGame, { isLoading: isJoining }] = useJoinGameMutation();
  const [createdGameId, setCreatedGameId] = useState<null | number>(null);
  const [createForm] = Form.useForm<CreateGameFormValues>();
  const [joinForm] = Form.useForm<JoinFormValues>();
  const navigate = useNavigate();

  const handleCreate = async (values: CreateGameFormValues) => {
    try {
      const res = await createGame(values).unwrap();
      setCreatedGameId(res.gameId);
      message.success('Игра создана. Введите ник, чтобы подключиться');
      joinForm.resetFields();
    } catch (err) {
      console.error(err);
      message.error('Не удалось создать игру');
    }
  };

  const handleJoin = async (values: JoinFormValues) => {
    if (!createdGameId) return;
    try {
      const res = await joinGame({ gameId: createdGameId, nickname: values.nickname }).unwrap();
      message.success('Вы подключены к игре');
      navigate(`/game/${res.gameId}`);
    } catch (err) {
      console.error(err);
      message.error('Не удалось подключиться к игре');
    }
  };

  return (
    <Page>
      <Flex align="center" justify="center" fullWidth fullHeight>
        <Card animation="none" width={480}>
          <Flex direction="column" gap={16}>
            <Typography.Title level={4}>Создать игру</Typography.Title>
            <Form<CreateGameFormValues> form={createForm} layout="vertical" onFinish={handleCreate}>
              <Form.Item
                label="Название игры"
                name="gameName"
                rules={[{ message: 'Введите название игры', required: true }]}
              >
                <Input placeholder="Название" />
              </Form.Item>
              <Form.Item
                label="Количество игроков"
                name="maxSeatsCount"
                rules={[{ message: 'Выберите количество игроков', required: true }]}
              >
                <Select
                  options={maxSeatsOptions.map(v => ({ label: v.toString(), value: v }))}
                  placeholder="3-5"
                />
              </Form.Item>
              <Form.Item
                label="Время на ход (сек)"
                name="turnTime"
                rules={[{ message: 'Выберите время на ход', required: true }]}
              >
                <Select
                  options={turnTimeOptions.map(v => ({ label: v.toString(), value: v }))}
                  placeholder="20-60"
                />
              </Form.Item>
              <Button type="submit" variant="primary" fullWidth disabled={isCreating}>
                {isCreating ? 'Создание...' : 'Создать'}
              </Button>
            </Form>

            <Typography.Title level={5}>Подключиться как создатель</Typography.Title>
            <Form<JoinFormValues> form={joinForm} layout="vertical" onFinish={handleJoin}>
              <Form.Item
                label="Никнейм"
                name="nickname"
                rules={[{ message: 'Введите никнейм', required: true }]}
              >
                <Input placeholder="Ваш ник" />
              </Form.Item>
              <Button
                type="submit"
                variant="accent"
                fullWidth
                disabled={!createdGameId || isJoining}
              >
                {isJoining ? 'Подключение...' : 'Подключиться'}
              </Button>
            </Form>
          </Flex>
        </Card>
      </Flex>
    </Page>
  );
};
