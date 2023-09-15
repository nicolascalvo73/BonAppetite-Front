import { styled } from "styled-components";

export const Divider = () => {
  return <StyledDivider />;
};

const StyledDivider = styled.div`
  height: 0.25rem;
  align-self: stretch;
  border-radius: 0.625rem;
  background: ${(props) => props.theme.text};
  opacity: .25;
`;
