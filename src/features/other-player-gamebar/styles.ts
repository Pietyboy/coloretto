import styled from "styled-components";

export const IndicatorsGrid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing(2)};
  width: 100%;
`;
