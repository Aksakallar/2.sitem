import React, { useRef, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

import music from "../assets/audio/Al 1de Burdan Yak.mp3";

const Box = styled.div`
  display: flex;
  cursor: pointer;
  position: fixed;
  left: 8rem;
  top: 2.2rem;
  z-index: 10;
  align-items: center;

  & > *:nth-child(1) {
    animation-delay: 0.2s;
  }
  & > *:nth-child(2) {
    animation-delay: 0.3s;
  }
  & > *:nth-child(3) {
    animation-delay: 0.4s;
  }
  & > *:nth-child(4) {
    animation-delay: 0.5s;
  }
  & > *:nth-child(5) {
    animation-delay: 0.6s;
  }

  @media screen and (max-width: 800px) {
    left: 6.5rem;
    top: 1.8rem;
  }

  @media screen and (max-width: 500px) {
    left: 5.5rem;
    top: 2.2rem;
  }

  @media screen and (max-width: 400px) {
    left: 4.5rem;
    top: 2.4rem;
  }
`;

const play = keyframes`  0% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(2);
  }
  100% {
    transform: scaleY(1);
  }
`;

const arrowBounce = keyframes`
  0%, 100% {
    transform: rotate(-45deg) translateY(0);
  }
  50% {
    transform: rotate(-45deg) translateY(-8px);
  }
`;

const arrowBounceMobile = keyframes`
  0%, 100% {
    transform: rotate(0deg) translateY(0);
  }
  50% {
    transform: rotate(0deg) translateY(-8px);
  }
`;

const ArrowIndicator = styled.div`
  position: fixed;
  left: 11rem;
  top: 4rem;
  z-index: 9;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${arrowBounce} 1s ease-in-out infinite;
  pointer-events: none;

  &::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 15px solid #000000;
  }

  &::after {
    content: '';
    width: 4px;
    height: 25px;
    background-color: #000000;
    border-radius: 2px;
  }

  @media screen and (max-width: 800px) {
    left: 7rem;
    top: 4rem;
    animation: ${arrowBounceMobile} 1s ease-in-out infinite;
  }

  @media screen and (max-width: 500px) {
    left: 6rem;
    top: 4.5rem;
    animation: ${arrowBounceMobile} 1s ease-in-out infinite;
  }

  @media screen and (max-width: 400px) {
    left: 5rem;
    top: 4.5rem;
    animation: ${arrowBounceMobile} 1s ease-in-out infinite;
  }
`;

const Line = styled.span`
  background: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.body};

  animation: ${play} 1s ease infinite;
  animation-play-state: ${(props) => (props.click ? "running" : "paused")};
  height: 1rem;
  width: 2px;
  margin: 0 0.1rem;
`;

const Sesbar = () => {
  const ref = useRef(null);
  const [click, setClick] = useState(false);
  const [showArrow, setShowArrow] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(() => {
    return localStorage.getItem('musicBoxClicked') === 'true';
  });

  useEffect(() => {
    if (!hasInteracted) {
      const timer = setTimeout(() => {
        setShowArrow(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasInteracted]);

  const handClick = () => {
    setClick(!click);

    if (!hasInteracted) {
      localStorage.setItem('musicBoxClicked', 'true');
      setHasInteracted(true);
    }

    if (!click) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  };

  return (
    <>
      {!hasInteracted && showArrow && <ArrowIndicator />}
      <Box onClick={handClick}>
        <Line click={click} />
        <Line click={click} />
        <Line click={click} />
        <Line click={click} />
        <Line click={click} />
        <audio src={music} ref={ref} loop />
      </Box>
    </>
  );
};

export default Sesbar;
