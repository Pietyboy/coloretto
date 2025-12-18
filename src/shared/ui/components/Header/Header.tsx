import { useEffect, useRef, useState } from 'react';

import { useLocation, useNavigate } from 'react-router';

import { Button } from '../Button';
import { Image } from '../Image';

import { defaultHeaderTabs } from './constants';
import { GameMenu, HeaderInner, HeaderRoot, ProfileButton, ProfileMenu, ProfileWrapper, TabButton, TabsList } from './header.styled';
import type { HeaderProps } from './types';

export const Header = ({
  activeGames = [],
  activeTab,
  onLogout,
  onProfileClick,
  onTabChange,
  profileAlt = 'profile',
  tabs = defaultHeaderTabs,
}: HeaderProps) => {

  const location = useLocation();
  const navigate = useNavigate();
  const [gamesMenuOpen, setGamesMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const gamesRef = useRef<HTMLDivElement>(null);

  const isOnGamePage = location.pathname.startsWith('/game/') && !location.pathname.startsWith('/game/create');

  const onTabClick = (id: string) => {
    onTabChange?.(id)
    navigate(`/${id}`)
  };

  const handleProfileClick = () => {
    onProfileClick?.();
    setMenuOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (gamesRef.current && !gamesRef.current.contains(event.target as Node)) {
        setGamesMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return(
    <HeaderRoot>
      <HeaderInner>
        <TabsList aria-label="Навигация по разделам">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              type="button"
              $active={tab.id === activeTab}
              onClick={() => onTabClick(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
          {activeGames.length > 0 && (
            <ProfileWrapper ref={gamesRef}>
              <TabButton
                type="button"
                $active={isOnGamePage}
                onClick={() => {
                  if (activeGames.length === 1) {
                    navigate(`/game/${activeGames[0].gameId}`);
                  } else {
                    setGamesMenuOpen(prev => !prev);
                  }
                }}
              >
                Игра
              </TabButton>
              {gamesMenuOpen && activeGames.length > 1 && (
                <GameMenu>
                  {activeGames.map(game => (
                    <button
                      key={game.gameId}
                      type="button"
                      onClick={() => {
                        setGamesMenuOpen(false);
                        navigate(`/game/${game.gameId}`);
                      }}
                    >
                      {game.gameName}
                    </button>
                  ))}
                </GameMenu>
              )}
            </ProfileWrapper>
          )}
        </TabsList>
        <ProfileWrapper ref={profileRef}>
          <ProfileButton aria-label="Открыть профиль" onClick={handleProfileClick}>
            <Image alt={profileAlt} height={36} variant="profileIcon" width={36} />
          </ProfileButton>
          {menuOpen && (
            <ProfileMenu>
              <Button
                fullWidth
                onClick={() => {
                  setMenuOpen(false);
                  onLogout?.();
                }}
                size="sm"
                variant="outline"
              >
                Выйти
              </Button>
            </ProfileMenu>
          )}
        </ProfileWrapper>
      </HeaderInner>
    </HeaderRoot>
  );
};
