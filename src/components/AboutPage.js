import React from 'react'
import styled, { ThemeProvider, keyframes } from 'styled-components'
import { DarkTheme } from './Themes';
import LogoComponent from '../subComponents/LogoComponent';
import PowerButton from '../subComponents/PowerButton';
import SocialIcons from '../subComponents/SocialIcons';
import CellComponent from '../subComponents/CellComponent';
import AnaTitle from '../subComponents/AnaTitle';
import uzayadami from '../assets/Images/spaceman.png';

const Box = styled.div`
  background-color: ${props => props.theme.body};
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`

const float = keyframes`
  0%   { transform: translateY(-10px) }
  50%  { transform: translateY(25px) translateX(15px) }
  100% { transform: translateY(-10px) }
`

const Spaceman = styled.div`
  position: absolute;
  top: 10%;
  right: 8%;
  width: 14vw;
  animation: ${float} 5s ease infinite;

  img {
    width: 100%;
    height: auto;
  }

  @media screen and (max-width: 800px) {
    width: 28vw;
    top: 4%;
    right: 5%;
  }
`

const Main = styled.div`
  border: 2px solid ${props => props.theme.text};
  color: ${props => props.theme.text};
  padding: 2.5rem 3rem;
  width: 46vw;
  z-index: 3;
  line-height: 1.7;
  backdrop-filter: blur(4px);
  position: absolute;
  left: calc(5rem + 5vw);
  top: 50%;
  transform: translateY(-50%);
  font-family: 'Ubuntu Mono', monospace;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media screen and (max-width: 800px) {
    width: 85vw;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -42%);
    padding: 1.5rem;
  }
`

const Name = styled.h2`
  font-size: calc(1.1rem + 1vw);
  font-weight: 700;
  font-style: normal;
  letter-spacing: 0.04em;
  margin: 0;

  @media screen and (max-width: 800px) {
    font-size: 1.2rem;
  }
`

const Role = styled.span`
  font-size: calc(0.55rem + 0.6vw);
  opacity: 0.6;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-style: normal;
  margin-top: -0.5rem;

  @media screen and (max-width: 800px) {
    font-size: 0.7rem;
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${props => props.theme.text};
  opacity: 0.3;
  margin: 0;
`

const Para = styled.p`
  font-size: calc(0.55rem + 0.65vw);
  font-style: normal;
  margin: 0;
  opacity: 0.88;

  em {
    font-style: italic;
    opacity: 1;
  }

  @media screen and (max-width: 800px) {
    font-size: 0.78rem;
  }
`

const AboutPage = () => {
  return (
    <ThemeProvider theme={DarkTheme}>
      <Box>
        <LogoComponent theme='dark' />
        <PowerButton />
        <SocialIcons theme='dark' />
        <CellComponent theme='dark' />

        <Spaceman>
          <img src={uzayadami} alt='Spaceman' />
        </Spaceman>

        <Main>
          <Name>Mehmet Asker</Name>
          <Role>Agile Coach &amp; Technical Mentor</Role>
          <Divider />
          <Para>
            My journey has taken me through <em>satellite technology</em>, live casino operations, and multi-level marketing — each chapter teaching me something the next one needed.
          </Para>
          <Para>
            I build things on the web. I read, research, and surprise people with what I create. I believe anything crafted with both <em>heart and mind</em> can become a work of art.
          </Para>
          <Para>
            Currently focused on front-end development, growing one project at a time.
          </Para>
        </Main>

        <AnaTitle text="About" top="10%" left="5%" />
      </Box>
    </ThemeProvider>
  )
}

export default AboutPage
