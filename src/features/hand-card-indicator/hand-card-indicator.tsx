import { Flex, Image, Typography } from '../../shared/ui/components';
import { ImageVariant } from '../../shared/ui/components/Image/types';

import { gugiFontStyle } from './constants';

const { Text } = Typography;

type CardIndicatorProps = {
  count: number;
  indicator: ImageVariant;
  size?: string;
};

export const HandCardIndicator = ({ count, indicator, size = 'large' }: CardIndicatorProps) => (
  <Flex align="center" direction="row" gap={2}>
    <Image height={size === 'large' ? 29 : 14} variant={indicator} width={size === 'large' ? 27 : 13} />
    <Image height={5} width={5} variant='closeIcon'/>
    <Text style={gugiFontStyle} tone="secondary" size={size === 'large' ? 'large' : 'regular'}>
      {count}
    </Text>
  </Flex>
);
