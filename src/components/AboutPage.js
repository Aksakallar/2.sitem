import React from 'react'
import styled,{ ThemeProvider, keyframes } from 'styled-components'
import {DarkTheme} from './Themes';
import LogoComponent from '../subComponents/LogoComponent';
import PowerButton from '../subComponents/PowerButton';
import SocialIcons from '../subComponents/SocialIcons';
import CellComponent from '../subComponents/CellComponent';
import AnaTitle from '../subComponents/AnaTitle';
import uzayadami from '../assets/Images/spaceman.png';


  const Box = styled.div`
    background-color: ${props=>props.theme.body};
    width: 100vw;
    height: 100vh;
    position: relative;
    owerflow: hidden; 
    `

  const float = keyframes`
    0%{transform: translateY(-10px)}
    50%{transform: translateY(25px) translate(25px)}
    100%{transform: translateY(-10px) }
  `

  const Spaceman = styled.div`
    position: absolute; 
    top: 10%;
    right: 10%;
    width: 15vw; 
    animation: ${float} 5s ease infinite;


    img{ 
      width: 100%;
      height: auto;
    }

    @media screen and (max-width: 800px) {
      top: 5%;
      right: 20%;

    }
  `

  const Main = styled.div`
    border: 2px solid ${props => props.theme.text};
    color: ${props => props.theme.text};
    padding: 3rem; 
    width: 50vw; 
    height: 60vh;
    z-index: 3;
    line-height: 1.5;

    display: flex; 
    justify-content: center;
    align-items: center; 
    font-size: calc(0.6rem + 1vw); 
    backdrop-filter: blur(3px); 

    position: absolute; 
    left: calc(5rem + 5vw);
    top: 10rem; 

    font-family: 'Ubuntu Mono', monospace; 
    font-style: italic;


   
  `

const AboutPage = () => {
  return (


    <ThemeProvider theme={DarkTheme}>
      
      <Box>

        <LogoComponent theme='dark'/>
        <PowerButton/>
        <SocialIcons theme='dark'/>
        <CellComponent theme='dark'/>

        <Spaceman>
            <img src={uzayadami} alt='Spaceman'/>
        </Spaceman>

        <Main>

              I design simple websites by improving myself. I plan to improve my skills with my own experience and reach my goals by increasing my experience.
              <br/> <br/>
              My roadmap also includes Satellite Technician, Live Casino, Multi-Level Marketing and finally Software industry information. I aim to build my future with this information. I like to read books and do research.
              <br/> <br/>
              I believe that everything you do with your heart and mind will turn into a work of art, and I design my future by imagining it. Feel free to connect with me on social links. 
              
        </Main>

        <AnaTitle text="About" top="10%" left="5%"/>

      </Box>

      
    </ThemeProvider>
  
  )
}

export default AboutPage