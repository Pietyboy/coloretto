import type { ReactNode } from 'react';

import type { ImageProps as AntImageProps } from 'antd';

import { imageSources } from './constants';

export type ImageVariant = keyof typeof imageSources;

export interface ImageProps extends Omit<AntImageProps, 'preview' | 'src'> {
  alt?: string;
  closable?: boolean;
  closeIcon?: ReactNode;
  onClose?: () => void;
  variant: string;
}
