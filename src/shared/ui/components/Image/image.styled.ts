import styled from 'styled-components';

export const ImageWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: rgba(34, 34, 34, 0.75);
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  padding: 0;
  transition: opacity ${({ theme }) => theme.transitions.base};

  &:hover {
    opacity: 0.85;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;
