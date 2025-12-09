import { PropsWithChildren } from 'react';

import { Navigate, Outlet, useLocation } from 'react-router';

import { Components } from '../../shared';

import { useAuthState } from './use-auth';

const { Flex } = Components;

type ProtectedRouteProps = PropsWithChildren;

export const ProtectedRoute = (_props: ProtectedRouteProps) => {
  const { authChecked, isAuth } = useAuthState();
  const location = useLocation();

  if (!authChecked) {
    return (
      <Flex align="center" justify="center" fullHeight fullWidth>
        Загрузка...
      </Flex>
    );
  }

  if (!isAuth) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
};
