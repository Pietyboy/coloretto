import { useState } from 'react';

import { Route, Routes, useLocation, useNavigate } from 'react-router';

import { ProtectedRoute } from '../features/auth/protected-route';
import { useAuthInit, useAuthState } from '../features/auth/use-auth';
import { CreateGamePage, HomePage } from '../pages';
import { GamePage } from '../pages/game';
import { LoginPage } from '../pages/login';
import { defaultHeaderTabs, Header } from '../shared/ui/components';
import { useLogoutMutation } from '../store/api/auth-api';
import { useGetGamesListQuery } from '../store/api/game-api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout as logoutAction } from '../store/slices/profile-slice';

const headerTabs = defaultHeaderTabs;
export const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();
  const { authChecked, isAuth } = useAuthState();
  const username = useAppSelector(state => state.profile.username);
  useAuthInit();
  const [activeTab, setActiveTab] = useState(headerTabs[0]?.id ?? 'lobby');
  const isLoginPage = location.pathname === '/login';
  const showHeader = !isLoginPage && authChecked && isAuth;
  const { data: gamesList = [] } = useGetGamesListQuery();
  const activeGames = gamesList
    .filter(game => game.players?.some(p => p.nickname === username))
    .map(game => ({ gameId: game.gameId, gameName: game.gameName }));

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(logoutAction());
      navigate('/login');
    }
  };

  return (
    <>
      {showHeader && (
        <Header
          activeGames={activeGames}
          activeTab={activeTab}
          onLogout={handleLogout}
          onTabChange={setActiveTab}
          tabs={headerTabs}
        />
      )}
      <Routes>
        <Route path='/login' element={<LoginPage/>}/>
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<HomePage />}/>
          <Route path="/game/create" element={<CreateGamePage />}/>
          <Route path="/game/:gameId" element={<GamePage/>}/>
        </Route>
      </Routes>
    </>
  )
};
