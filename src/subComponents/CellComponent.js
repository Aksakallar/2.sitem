import React from 'react'
import Particles from 'react-particles-js'
import styled from 'styled-components' 

// Hücreleri almak için Configden JSON ile gorusuyoruz
import configDark from '../config/particlesjs-config.json';
import configLight from '../config/particlesjs-config-light.json';

const Box = styled.div`

position: absolute;
top: 0;
right: 0;
left: 0;
botton: 0;
z-index: 0;


`

const CellComponent = (props) => {
  return (
    <Box >
        <Particles params={props.theme === "light" ? configLight : configDark} />
    </Box>
  )
}

export default CellComponent