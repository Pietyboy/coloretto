import { PropsWithChildren } from 'react';

import { PageRoot } from './page.styled';

export const Page = ({ children }: PropsWithChildren) => <PageRoot>{children}</PageRoot>;
