# Coloretto API

Бэкенд отдаёт JSON по префиксу `/api`.

## Базовый URL

- Локально: `http://localhost:3001/api`
- В сети: `https://coloretto-web-server-production.up.railway.app/api`

## Service

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

---

# User (alias)

Эти роуты используют ту же бизнес-логику, что и auth.

## POST `/api/user/create`
Регистрация.  
**Body**: `{ "login": "...", "password": "..." }`

## POST `/api/user/check`
Логин.  
**Body**: `{ "login": "...", "password": "..." }`

---

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
Создать игру.

**Body**
```json
{ "gameName": "Моя игра", "maxSeatsCount": 4, "turnTime": 40 }
```

**Response**
```json
{ "gameId": 123 }
```

## POST `/api/game/delete`
Удалить игру.

**Body**
```json
{ "gameId": 123 }
```

## POST `/api/game/join`
Подключиться к игре (резерв места/участие, без никнейма).

**Body**
```json
{ "gameId": 123 }
```

Если есть ошибка, сервер вернёт `400` с `{ "error": "..." }`.

## POST `/api/game/create-player`
Создать игрока в игре (никнейм).

**Body**
```json
{ "gameId": 123, "nickname": "Player 1" }
```

**Response (пример)**
```json
{ "player_id": 10, "nickname": "Player 1" }
```

Примечание: если игра в статусе `waiting` и после создания игрока количество игроков стало равно `maxPlayerCount`,
сервер может автоматически запустить игру (аналогично кнопке “Начать”).

**Body**: `{ "gameId": 123 }`

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
- При бизнес-ошибках игра может вернуть: `{ "state": { "error": "..." } }`.

## POST `/api/game/turn/card`
Сделать ход “положить карту в ряд”.

**Body**
```json
{ "gameId": 123, "playerId": 10, "rowId": 1 }
```

## POST `/api/game/turn/row`
Сделать ход “взять ряд”.

**Body**
```json
{ "gameId": 123, "playerId": 10, "rowId": 1 }
```

## POST `/api/game/choose-colors` (alias: `/api/game/colors`)
Выбор 3 цветов для подсчёта очков (финальная стадия).

**Body**
```json
{ "gameId": 123, "playerId": 10, "colorIds": [1, 2, 3] }
```

## POST `/api/game/joker/colors`
Выбор цветов для джокеров (финальная стадия).

**Body**
```json
{
  "gameId": 123,
  "playerId": 10,
  "choices": [
    { "card_id": 555, "color": "red" }
  ]
}
```

## POST `/api/game/finish/game`
Завершить игру (серверная финализация).

**Body**: `{ "gameId": 123 }`

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

## GET `/api/game/:gameId/card/:cardId`
Получить информацию о карте (используется при открытии верхней карты колоды).

**Response (пример)**
```json
{ "cardId": 555, "color": "red", "type": "common" }
```
