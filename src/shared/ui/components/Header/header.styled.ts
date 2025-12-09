import styled from 'styled-components';

export const HeaderRoot = styled.header`
  border-bottom: 1px solid #222222;
`;

export const HeaderInner = styled.div`
  margin: 0 auto;
  max-width: 1040px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const TabsList = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  flex-wrap: wrap;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  background: transparent;
  border: none;
  padding: 0;
  font-family: inherit;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.base};

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const ProfileButton = styled.button`
  border: none;
  background: #222222;
  padding: ${({ theme }) => theme.spacing(1)};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  display: inline-flex;
  align-items: flex-start;
  justify-content: center;
  transition: background ${({ theme }) => theme.transitions.base};
  width: 36px;
  height: 36px;

  &:hover {
    background: rgba(34, 34, 34, 0.1);
  }
`;

export const ProfileWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

export const ProfileMenu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceMuted};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: ${({ theme }) => theme.spacing(2)};
  min-width: 140px;
  z-index: 10;
  display: flex;
`;

export const GameMenu = styled(ProfileMenu)`
  min-width: 200px;

  button {
    width: 100%;
    background: transparent;
    border: none;
    padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
    color: ${({ theme }) => theme.colors.textPrimary};
    text-align: left;
    border-radius: ${({ theme }) => theme.radii.sm};
    cursor: pointer;
    transition: background ${({ theme }) => theme.transitions.base};

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceMuted};
    }
  }
`;
