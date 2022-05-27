import React from 'react'
import styled,{ ThemeProvider } from 'styled-components'
import {lightTheme} from './Themes';
import { Design,Develope } from './AllSvgs';
import LogoComponent from '../subComponents/LogoComponent';
import PowerButton from '../subComponents/PowerButton';
import SocialIcons from '../subComponents/SocialIcons';
import CellComponent from '../subComponents/CellComponent';
import AnaTitle from '../subComponents/AnaTitle';


  const Box = styled.div`
  background-color: ${props=>props.theme.body};
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex; 
  justify-content: space-evenly; 
  align-items: center;

  

`
  const Main = styled.div`
  border: 2px solid ${props=>props.theme.text};
  color: ${props=>props.theme.text};
  background-color: ${props=>props.theme.body}; 
  padding: 2rem; 
  width: 30vw;
  height: 60vh;
  z-index: 3;
  line-height: 1.5;
  cursor: pointer;

  font-family: 'Ubuntu Mono' ,monospace;
  display: flex; 
  flex-direction: column; 
  justify-content: space-between; 

  &:hover {
    color: ${props => props.theme.body};
    background-color: ${props => props.theme.text};
  }

 
`

const Title = styled.h2`

display: flex; 
justify-content: center;
align-items: center;
font-size: calc(1em + 1vw);

${Main}:hover &{
    &>*{
      fill:${props => props.theme.body};
    }
}
&>*:first-child {
      margin-right: 1rem;
}

`

const Description = styled.div`

color: ${props => props.theme.text};
font-size: calc(0.6em + 1vw);
padding: 0.5rem 0;

${Main}:hover &{
  
    color:${props => props.theme.body};

}

strong{
  margin-botton: 1rem;
  text-transform: uppercase;
}
ul,p{
  margin-left: 2rem;
}


`

const MySkillsPage = () => {
  return (


    <ThemeProvider theme={lightTheme}>
      
      <Box>

      <LogoComponent theme='light'/>
      <PowerButton/>
      <SocialIcons theme='light'/>
      <CellComponent theme='light'/>
        <Main>
          <Title>
            <Design width={35} height={35}/> Designer
          </Title>

          <Description >
          I like to learn and design things instead of wasting my free time
          </Description>
          <Description >
              <strong>I like to Design</strong> 
                <ul>
                  <li>Web Design</li>
                  <li>Mobile Apps</li>
                </ul>

          </Description>

          <Description >
              <strong>Tools</strong> 
              <p>
              Adobe Illustrator 
                </p>

          </Description>

          
        </Main>

        <Main>
          <Title>
            <Develope width={35} height={35}/> Developer
          </Title>

          <Description >
              I value a job or brand I do, so I improve myself by bringing new ideas to life. 
          </Description>
          <Description >
              <strong>Skills</strong> 
              <p>
               C, C++, Html, Css, Sass Bootstrap, Js, React, Firebase.
                </p>

          </Description>
          <Description >
              <strong>Tools</strong> 
              <p>
                VScode, Github etc.
                </p>

          </Description>
        </Main>
        <AnaTitle text="About" top="80%" right="30%"/>
      </Box>

      
    </ThemeProvider>
  
  )
}

export default MySkillsPage