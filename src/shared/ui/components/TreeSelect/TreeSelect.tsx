import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { TreeSelect as AntTreeSelect } from 'antd';

export type TreeSelectProps = ComponentPropsWithoutRef<typeof AntTreeSelect>;
type TreeSelectRef = ElementRef<typeof AntTreeSelect>;

const BaseTreeSelect = forwardRef<TreeSelectRef, TreeSelectProps>((props, ref) => (
  <AntTreeSelect ref={ref} {...props} />
));

BaseTreeSelect.displayName = 'TreeSelect';

export const TreeSelect = Object.assign(BaseTreeSelect, {
  TreeNode: AntTreeSelect.TreeNode,
});
