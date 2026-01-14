import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { Empty as AntEmpty } from 'antd';

import { Typography } from '../Typography';
import type { TextSize, TextTone } from '../Typography/types';

export type EmptyProps = ComponentPropsWithoutRef<typeof AntEmpty> & {
  message?: ReactNode;
  messageSize?: TextSize;
  messageTone?: TextTone;
};

export const Empty = ({
  description,
  image,
  imageStyle,
  message,
  messageSize = 'small',
  messageTone = 'secondary',
  ...rest
}: EmptyProps) => {
  const resolvedDescription = message ?? description;
  const finalDescription = resolvedDescription === undefined ? 'Пусто' : resolvedDescription;
  const nextDescription =
    typeof finalDescription === 'string' ? (
      <Typography.Text size={messageSize} tone={messageTone}>
        {finalDescription}
      </Typography.Text>
    ) : (
      finalDescription
    );

  const resolvedImage = image ?? null;
  const resolvedImageStyle =
    resolvedImage === null ? { height: 0, margin: 0, ...(imageStyle ?? {}) } : imageStyle;

  return (
    <AntEmpty
      {...rest}
      description={nextDescription}
      image={resolvedImage}
      imageStyle={resolvedImageStyle}
    />
  );
};
