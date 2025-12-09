import { CloseOutlined } from '@ant-design/icons';
import { Image as AntImage } from 'antd';

import { imageSources } from './constants';
import { CloseButton, ImageWrapper } from './image.styled';
import type { ImageProps, ImageVariant } from './types';

export const Image = ({
  alt,
  closable = false,
  closeIcon,
  onClose,
  variant,
  ...rest
}: ImageProps) => (
  <ImageWrapper>
    <AntImage
      alt={alt ?? variant}
      preview={false}
      src={imageSources[variant as ImageVariant]}
      {...rest}
    />
    {closable && (
      <CloseButton
        aria-label="close image"
        onClick={(event) => {
          event.stopPropagation();
          onClose?.();
        }}
        type="button"
      >
        {closeIcon ?? <CloseOutlined />}
      </CloseButton>
    )}
  </ImageWrapper>
);
