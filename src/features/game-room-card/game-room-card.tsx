import { useNavigate } from "react-router";

import { Components } from "../../shared";

import { TGame } from "./type";

const { Button, Card, Flex, Typography } = Components;
const { Text } = Typography;

type TGameRoomCard = {
  game: TGame;
}

export const GameRoomCard = ({ game }: TGameRoomCard) => {

  const novigate = useNavigate();

  const handleGameConnect = () => {
    novigate(`/game/${game.gameId}`)
  }

  const getGameDate = (date: string) => {
    return new Date(date).getDate();
  }

    return(
      <Card
        height={195}
        width={180}
        >
        <Flex align="start" justify="space-between" fullHeight>
            <Flex align="start" direction="column">
                <Text tone="secondary" >{game.gameName}</Text>
                <Text tone="secondary" >Количество игроков: {game.currentPlayersCount}/{game.maxPlayerCount}</Text>
                <Text tone="secondary" >Дата создания: {getGameDate(game.startingDate)}</Text>
            </Flex>
            <Button buttonRadii='sm' onClick={handleGameConnect} variant="accent" fullWidth>Подключиться</Button>
        </Flex>
      </Card>
    );
}
