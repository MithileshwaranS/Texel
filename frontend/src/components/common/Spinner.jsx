import React from "react";
import styled, { keyframes } from "styled-components";

// Keyframes for the spinning animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled spinner component
const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(props) => (props.fullScreen ? "100vh" : "auto")};
  padding: ${(props) => (props.fullScreen ? "0" : "2rem")};
`;

const SpinnerCore = styled.div`
  width: ${(props) =>
    props.size === "large" ? "4rem" : props.size === "small" ? "2rem" : "3rem"};
  height: ${(props) =>
    props.size === "large" ? "4rem" : props.size === "small" ? "2rem" : "3rem"};
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${(props) => props.color || "#6366f1"};
  animation: ${spin} 0.8s linear infinite;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    border: 4px solid transparent;
    border-top-color: ${(props) => props.secondaryColor || "#a5b4fc"};
    opacity: 0.7;
    animation: ${spin} 1s linear infinite reverse;
  }
`;

// Spinner component with props for customization
const Spinner = ({
  size = "medium", // 'small', 'medium', 'large'
  color = "#6366f1", // primary color
  secondaryColor = "#a5b4fc", // secondary color
  fullScreen = false, // whether to take full viewport height
  className = "", // additional className
}) => {
  return (
    <SpinnerContainer fullScreen={fullScreen} className={className}>
      <SpinnerCore size={size} color={color} secondaryColor={secondaryColor} />
    </SpinnerContainer>
  );
};

export default Spinner;
