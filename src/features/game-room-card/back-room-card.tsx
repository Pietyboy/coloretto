import { Button, Flex, Typography } from "../../shared/ui/components";

const { Text } = Typography;

type TBackRoomCard = {
    onButtonClick: () => void;
}

export const BackRoomCard = ({onButtonClick}: TBackRoomCard) => {
    return(
        <Flex align="center" justify="space-between" fullHeight>
            <Flex align="start" direction="column">
                <Text tone="secondary" >Название комнаты</Text>
                <Text tone="secondary" >Количество игроков</Text>
                <Text tone="secondary" >Дата создания</Text>
            </Flex>
            <Button buttonRadii='sm' onClick={onButtonClick} variant="accent" fullWidth>Подключиться</Button>
        </Flex>
    );
}