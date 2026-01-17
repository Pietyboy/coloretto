# Coloretto API

Бэкенд отдаёт JSON по префиксу `/api`.

## Базовый URL

- Локально: `http://localhost:3001/api`
- В сети: `https://coloretto-web-server-production.up.railway.app/api`

## Service

### GET `/api/ping`
Проверка доступности сервиса.

**Response**
```json
{ "status": "ok" }
```

### GET `/api/test-db` (debug)
Проверка доступности БД (может быть отключено/ограничено в продакшене).

## Формат запросов

- `Content-Type: application/json`
- Тело запросов — JSON.

## Авторизация

Эндпоинты `/api/game/**` требуют заголовок:

```
Authorization: Bearer <accessToken>
```

Токен выдаётся при логине/регистрации.

### Refresh-токен

Refresh-токен хранится в httpOnly cookie `refreshToken` (устанавливается сервером).  
Для `fetch`/RTK Query нужен `credentials: "include"`, чтобы cookie отправлялась на `/api/auth/refresh`.

## Ошибки

- Ошибки уровня HTTP: `{ "error": "..." }` (например, 400/401/500).
- Для некоторых бизнес-ошибок сервер может вернуть `200` с `{ error: "..." }` в теле ответа (зависит от SQL-функции).
- Для `GET /api/game/state/:id` возможна ошибка внутри состояния: `{ state: { error: "..." } }`.

---

# Auth

## POST `/api/auth`
Логин (проверка учётных данных).

**Body**
```json
{ "username": "user", "password": "pass" }
```

**Response (пример)**
```json
{
  "userId": 1,
  "username": "user",
  "token": "<accessToken>",
  "accessToken": "<accessToken>"
}
```

Сервер также устанавливает cookie `refreshToken`.

## POST `/api/auth/login`
Регистрация (создание пользователя).

**Body**
```json
{ "username": "user", "password": "pass" }
```

**Response** — как у `/api/auth` (и тоже ставится cookie `refreshToken`).

## POST `/api/auth/refresh`
Обновление access-токена.

- По умолчанию берёт refresh-токен из cookie `refreshToken`.
- Также поддерживается вариант через body: `{ "refreshToken": "..." }`.

**Response** — как у `/api/auth` (сервер обновляет cookie `refreshToken`).

## POST `/api/auth/logout`
Выход (очистка cookie).

**Response**
```json
{ "success": true }
```

# Game (требует Authorization)

## GET `/api/game/list`
Список доступных игр.

**Response**: `TGameApi[]` (примерно)
```json
[
  {
    "gameId": 1,
    "gameName": "Моя игра",
    "startingDate": "2026-01-16T10:00:00.000Z",
    "maxPlayerCount": 4,
    "turnDuration": 40,
    "currentPlayersCount": 2,
    "gameStatus": "waiting"
  }
]
```

## GET `/api/game/hosted`
Список игр, где текущий пользователь — хост.

## POST `/api/game/create/game`
Создать игру.<br>
Длительность хода может быть от 20 и до 60 секунд

**Body**
```json
{ "name": "Моя игра", "seats": 4, "turnDuration": 40, "nickname": "Хост" }
```

**Response**
```json
{ "status": "success", "gameId": 123, "playerId": 10 }
```

## POST `/api/game/delete`
Удалить игру.

**Body**
```json
{ "gameId": 123 }
```

## POST `/api/game/join`
Подключиться к игре.

Логика подключения теперь полностью работает через `game_join_game`:
- Сначала вызываем без никнейма: `{ "gameId": 123 }`
  - Если игрок уже создан, сервер вернёт:
    ```json
    { "status": "success", "mode": "existing", "gameId": 123, "playerId": 10 }
    ```
  - Если нужно создать игрока, сервер вернёт:
    ```json
    { "status": "need_nickname", "message": "Нужно создать игрока: введите никнейм", "gameId": 123 }
    ```
- Если получили `need_nickname`, повторяем запрос уже с никнеймом:
  ```json
  { "gameId": 123, "nickname": "Player 1" }
  ```
  При успехе:
  ```json
  { "status": "success", "mode": "created", "gameId": 123, "playerId": 10 }
  ```

**Body**
```json
{ "gameId": 123 }
```

Если есть ошибка, сервер вернёт `400` с `{ "error": "..." }`.

## POST `/api/game/create-player`
Создать игрока в игре (legacy).

Рекомендуемый способ — использовать `POST /api/game/join` с `nickname`.

**Body**
```json
{ "gameId": 123, "nickname": "Player 1" }
```

**Response (пример)**
```json
{ "status": "success", "mode": "created", "gameId": 123, "playerId": 10 }
```

Примечание: если игра в статусе `waiting` и после создания игрока количество игроков стало равно `maxPlayerCount`,
сервер может автоматически запустить игру (аналогично кнопке “Начать”).


## GET `/api/game/me/:gameId`
Проверка участия текущего пользователя в игре.

**Response**
```json
{ "inGame": true, "player_id": 10, "nickname": "Player 1" }
```
или
```json
{ "inGame": false }
```

## GET `/api/game/state/:id`
Получить состояние игры.

**Response**
```json
{ "state": { /* ... */ } }
```

Важно:
- Этот запрос обновляет “присутствие” игрока и может триггерить автоход на сервере.
- Этот запрос также может автоматически запустить игру, если она в статусе `waiting` и игроков уже `maxPlayerCount`.
- При бизнес-ошибках игра может вернуть: `{ "state": { "error": "..." } }` или `{ "state": { "error": "...", "gameId": 123 } }`.
- В ответ добавляются `serverNow` (epoch ms) и `turnEndsAt` (epoch ms) для отображения таймера относительно времени сервера.
- В ответ добавляется `players[].isConnected` (boolean) — присутствие игрока на сервере.

## POST `/api/game/turn/card`
Сделать ход “положить карту в ряд”.

Важно: `playerId` определяется на сервере по JWT-токену и не передаётся в запросе.
Также важно: перед тем, как положить карту, нужно “открыть” верхнюю карту колоды через `GET /api/game/:gameId/card`
(это помечает на сервере, что игрок посмотрел карту; иначе SQL-функция хода может вернуть ошибку).

**Body**
```json
{ "gameId": 123, "rowId": 1 }
```

## POST `/api/game/turn/row`
Сделать ход “взять ряд”.

**Body**
```json
{ "gameId": 123, "rowId": 1 }
```

## POST `/api/game/choose-colors` (alias: `/api/game/colors`)
Выбор 3 цветов для подсчёта очков (финальная стадия).

Важно: `playerId` определяется на сервере по JWT-токену и не передаётся в запросе.

**Body**
```json
{ "gameId": 123, "colorIds": [1, 2, 3] }
```

## POST `/api/game/joker/colors`
Выбор цветов для джокеров (финальная стадия).

Важно: `playerId` определяется на сервере по JWT-токену и не передаётся в запросе.

**Body**
```json
{
  "gameId": 123,
  "choices": [
    { "card_id": 555, "color": "red" }
  ]
}
```

## GET `/api/game/score/:id`
Таблица результатов.

**Response**
```json
{
  "scores": [
    { "playerId": 10, "nickname": "Player 1", "score": 12 }
  ]
}
```

## GET `/api/game/:gameId/card`
Получить информацию о верхней карте колоды (используется при открытии карты).

Этот эндпоинт также фиксирует на сервере, что игрок “посмотрел” верхнюю карту в текущем ходе.

**Response (пример)**
```json
{ "cardId": 555, "color": "red", "type": "common" }
```
