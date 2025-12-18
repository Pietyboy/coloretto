import { useEffect, useMemo, useState } from 'react';

import { Route, Routes, useLocation, useNavigate } from 'react-router';

import { ProtectedRoute } from '../features/auth/protected-route';
import { useAuthInit, useAuthState } from '../features/auth/use-auth';
import { CreateGamePage, HomePage } from '../pages';
import { GamePage } from '../pages/game';
import { LoginPage } from '../pages/login';
import { ACTIVE_GAMES_EVENT, clearActiveGames, getActiveGames } from '../shared/lib/active-games';
import { defaultHeaderTabs, ErrorBoundary, GlobalErrorListener, Header } from '../shared/ui/components';
import { useLogoutMutation } from '../store/api/auth-api';
import { useAppDispatch } from '../store/hooks';
import { logout as logoutAction } from '../store/slices/profile-slice';
import { NotificationProvider } from '../ui/notifications/NotificationProvider';

const headerTabs = defaultHeaderTabs;

const getActiveTabFromPathname = (pathname: string) => {
  if (pathname === '/' || pathname === '') return '';
  if (pathname.startsWith('/game/create')) return 'game/create';
  return '';
};

export const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();
  const { authChecked, isAuth } = useAuthState();
  useAuthInit();
  const isLoginPage = location.pathname === '/login';
  const showHeader = !isLoginPage && authChecked && isAuth;
  const [activeGames, setActiveGames] = useState(() => getActiveGames());
  const activeTab = useMemo(() => getActiveTabFromPathname(location.pathname), [location.pathname]);

  useEffect(() => {
    const handleActiveGamesChange = () => setActiveGames(getActiveGames());
    window.addEventListener(ACTIVE_GAMES_EVENT, handleActiveGamesChange);
    return () => window.removeEventListener(ACTIVE_GAMES_EVENT, handleActiveGamesChange);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (e) {
      console.log(e);
    } finally {
      clearActiveGames();
      dispatch(logoutAction());
      navigate('/login');
    }
  };

  return (
    <NotificationProvider>
      {showHeader && (
        <Header
          activeGames={activeGames}
          activeTab={activeTab}
          onLogout={handleLogout}
          tabs={headerTabs}
        />
      )}
      <GlobalErrorListener />
      <ErrorBoundary resetKey={location.pathname}>
        <Routes>
          <Route path='/login' element={<LoginPage/>}/>
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<HomePage />}/>
            <Route path="/game/create" element={<CreateGamePage />}/>
            <Route path="/game/:gameId" element={<GamePage/>}/>
          </Route>
        </Routes>
      </ErrorBoundary>
    </NotificationProvider>
  )
};
