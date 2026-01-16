import { PropsWithChildren } from 'react';

import { PageRoot } from './page.styled';

export type PageVariant = 'default' | 'game';

type PageProps = PropsWithChildren<{
  variant?: PageVariant;
}>;

export const Page = ({ children, variant = 'default' }: PageProps) => (
  <PageRoot $variant={variant}>{children}</PageRoot>
);
