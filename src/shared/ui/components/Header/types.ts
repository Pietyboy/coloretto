export type HeaderTab = {
  id: string;
  label: string;
};

export type HeaderProps = {
  activeTab: string;
  activeGames?: { gameId: number; gameName: string }[];
  onLogout?: () => void;
  onTabChange?: (tabId: string) => void;
  onProfileClick?: () => void;
  profileAlt?: string;
  tabs?: HeaderTab[];
};
