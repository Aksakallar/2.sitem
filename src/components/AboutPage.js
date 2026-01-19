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
    overflow: hidden; 
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

    @media screen and (max-width: 800px) {
      left: 50%;
      top: 50%;
      transform: translate(-48%, -50%);
    }


   
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

              I plan to improve my skills through my own experiences and reach my goals by continuously gaining new insights.
  <br/><br/>
  My roadmap includes knowledge from various fields such as Satellite Technology, Live Casino Operations, Multi-Level Marketing, and ultimately, the Software Industry. I aim to build my future using the experiences I gain along the way. I enjoy reading books, doing research, and surprising people with what I create.
  <br/><br/>
  I believe that anything crafted with both heart and mind can become a work of art. I envision and design my future with passion and creativity. Feel free to connect with me through my social links!
    
        </Main>

        <AnaTitle text="About" top="10%" left="5%"/>

      </Box>

      
    </ThemeProvider>
  
  )
}

export default AboutPage
