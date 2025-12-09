import type { ComponentPropsWithoutRef } from 'react';

import { Transfer as AntTransfer } from 'antd';

export type TransferProps = ComponentPropsWithoutRef<typeof AntTransfer>;

export const Transfer = (props: TransferProps) => <AntTransfer {...props} />;
