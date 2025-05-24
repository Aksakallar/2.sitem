import React from "react";
import styled from "styled-components";
import { DarkTheme } from "../components/Themes";

const Logo = styled.h1`
  display: inline-block;
  color: ${(props) =>
    props.color === "dark" ? DarkTheme.text : DarkTheme.body};
  font-family: "Pacifico", cursive;
  font-size: 1.8rem;

  position: fixed;
  left: 2rem;
  top: 2.2rem;
  z-index: 11;
  margin: 0;
  line-height: 1;

  @media screen and (max-width: 800px) {
    left: 1.5rem;
    top: 1.8rem;
    font-size: 1.6rem;
  }

  @media screen and (max-width: 500px) {
    left: 1rem;
    top: 2.2rem;
    font-size: 1.4rem;
  }

  @media screen and (max-width: 400px) {
    top: 2.4rem;
    font-size: 1.3rem;
  }
`;

const LogoComponent = (props) => {
  return <Logo color={props.theme}>MA</Logo>;
};

export default LogoComponent;
