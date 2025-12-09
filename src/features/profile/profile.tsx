import { Components } from "../../shared";

const { Card, Flex, Image } = Components;

type TProfileProps = {
    size?: 'large' | 'small';
}

export const Profile = ({ size: _size = 'large' }: TProfileProps) => {

    return(
        <Card animation="none" height={44} padding="none" width={44} overflow={true}>
            <Flex align="center" justify="end" fullWidth fullHeight>
                <Image variant="profileIcon"/>
            </Flex>
        </Card>
    );
}
