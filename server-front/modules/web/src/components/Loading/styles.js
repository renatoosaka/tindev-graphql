import styled, { keyframes } from "styled-components";
import { Logo } from "~/Styles";

export const Container = styled.div`
  display: flex;
  position: fixed;
  height: 100vh;
  width: 100%;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.2);
  justify-content: center;
  align-items: center;
`;

const rotate = keyframes`
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(20px);
  }

  100% {
    transform: translateY(0);
  }
`;

export const LogoAnimated = styled(Logo)`
  display: inline-block;
  animation: ${rotate} 1.5s ease-in-out infinite;
`;
