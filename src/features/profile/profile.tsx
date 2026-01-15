import { Components } from "../../shared";

const { Card, Flex, Image } = Components;

type TProfileProps = {
    iconVariant?: 'botIcon' | 'profileIcon';
    size?: 'large' | 'small';
}

export const Profile = ({ iconVariant = 'profileIcon', size: _size = 'large' }: TProfileProps) => {

    return(
        <Card animation="none" height={44} padding="none" width={44} overflow={true}>
            <Flex align="center" justify="end" fullWidth fullHeight>
                <Image variant={iconVariant}/>
            </Flex>
        </Card>
    );
}
