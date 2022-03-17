import React, {useRef, useEffect}from 'react';
import styled, { ThemeProvider } from 'styled-components'
import {DarkTheme} from './Themes';
import {motion} from 'framer-motion';

import LogoComponent from '../subComponents/LogoComponent';
import PowerButton from '../subComponents/PowerButton';
import AnaTitle from '../subComponents/AnaTitle';
import SocialIcons from '../subComponents/SocialIcons';

import { CasinoChip } from './AllSvgs';
import Card from '../subComponents/Card';
import {Work} from "../data/WorkData"




  const Box = styled.div`
    background-color: ${props=>props.theme.body};
    
    height: 400vh;
    position: relative;
    display: flex; 
    align-items: center;

    `

    const Main = styled(motion.ul)`

    position: fixed;
    top: 12rem; 
    left: calc(10rem + 15vw);
    height: 40vh; 
    display: flex;

    color: white;

    `


    const Rotate = styled.span`

      display: block;
      position: fixed; 
      right: 3rem;
      bottom: 2rem; 
      width: 80px; 
      height: 80px;
      z-index: 1;

    `

  // Framer-motion Yapılandırması 
  const container = {
    hidden:{opacity: 0},   
    show: {
      opacity: 1, 

      transition: {
        staggerChildren: 0.5,
        duration: 0.5,
      }
    }
  }

const WorkPage = () => {


  const ref = useRef(null)
  const casinochip = useRef(null)
  
  useEffect(() => {
    let element = ref.current;

    const rotate = () => {
      element.style.transform = `translateX(${-window.pageYOffset}px)`
      //Sayfada casinochip uygulamasının donmesi için
      casinochip.current.style.transform = `rotate(` + -window.pageYOffset + 'deg)'
    }

    window.addEventListener('scroll', rotate)

    return () => window.removeEventListener('scroll', rotate)

  },[])
    

  return (
    <ThemeProvider theme={DarkTheme}>
      
      <Box>

        <LogoComponent theme='dark'/>
        <PowerButton/>
        <SocialIcons theme='dark'/>

        <Main ref={ref} variants={container} initial='hidden' animate='show'>
          {
            Work.map(d => <Card key={d.id} data={d}/>)
          }
        </Main>
        
        <Rotate ref={casinochip}>
        <CasinoChip width={80} height={80} fill={DarkTheme.text}/>
        </Rotate>

        <AnaTitle text="WORK" top='10%' right="20%" />
      </Box>

      
    </ThemeProvider>
  
  )
}

export default WorkPage