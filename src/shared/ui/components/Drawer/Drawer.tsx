import { Drawer as AntDrawer } from 'antd';
import type { DrawerProps as AntDrawerProps } from 'antd';
import { useTheme } from 'styled-components';

import type { ColorettoTheme } from '../../themes/types';

export type DrawerProps = AntDrawerProps;

export const Drawer = ({ styles, ...rest }: DrawerProps) => {
  const theme = useTheme() as ColorettoTheme;
  const drawerTheme = theme.components?.drawer;

  const background = drawerTheme?.background ?? theme.colors.surface;
  const borderRadius = drawerTheme?.borderRadius ?? theme.radii.md;
  const colorText = drawerTheme?.colorText ?? theme.colors.textPrimary;

  const mergedStyles: DrawerProps['styles'] = {
    body: {
      background,
      borderRadius,
      color: colorText,
      ...styles?.body,
    },
    content: {
      background,
      borderRadius,
      ...styles?.content,
    },
    header: {
      background,
      borderBottom: 'none',
      borderRadius,
      color: colorText,
      ...styles?.header,
    },
    mask: {
      backdropFilter: 'blur(2px)',
      ...styles?.mask,
    },
    wrapper: styles?.wrapper,
  };

  return <AntDrawer styles={mergedStyles} {...rest} />;
};
