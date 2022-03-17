import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import {  Twitter, Facebook, Instagram} from '../components/AllSvgs'
import {DarkTheme} from "../components/Themes";
import { motion } from 'framer-motion'



const Icons = styled.div`

    display: flex;
    flex-direction: column;
    align-items: center;
    color: ${props => props.theme.text};
    position: fixed;
    bottom: 0;
    left: 2rem;
    
    z-index: 3;

    &>*:not(:last-child){
            margin: 0.5rem 0;
    }


   
`
 const Line = styled(motion.span)`

    width: 2px;
    height: 8rem;
    background-color: ${props => props.color === "dark" ?  DarkTheme.text : DarkTheme.body }

 `


const SocialIcons = (props) => {
  return (
    <Icons>
        
        <motion.div 
            initial={{transition:"scale(0)"}}
            animate={{scale:[0,1,1.5,1]}}
            transition={{type:'spring', duration:1, delay:1}}
        >
            <NavLink style={{color:'inherit'}} target="_blank" to={{pathname:"https://facebook.com"}}>
                <Facebook width={25} height={25} fill={props.theme === "dark" ?  DarkTheme.text : DarkTheme.body }/>
            </NavLink>
        </motion.div>

        <motion.div 
            initial={{transition:"scale(0)"}}
            animate={{scale:[0,1,1.5,1]}}
            transition={{type:'spring', duration:1, delay:1.2}}
        >
            <NavLink style={{color:'inherit'}} target="_blank" to={{pathname:"https://twitter.com/MehmetAsker10"}}>
                <Twitter width={25} height={25} fill={props.theme === "dark" ?  DarkTheme.text : DarkTheme.body }/>
            </NavLink>
        </motion.div>

      

        <motion.div 
            initial={{transition:"scale(0)"}}
            animate={{scale:[0,1,1.5,1]}}
            transition={{type:'spring', duration:1, delay:1.4}}
        >
            <NavLink style={{color:'inherit'}} target="_blank" to={{pathname:"https://www.instagram.com/m3hm3t_ask3r/"}}>
                <Instagram width={25} height={25} fill={props.theme === "dark" ?  DarkTheme.text : DarkTheme.body }/>
            </NavLink>
        </motion.div>

        <Line color={props.theme} 
            initial={{
                height:0
            }}
            animate={{
                height:'8rem'
            }}
            transition={{
                type:'spring', duration:1, delay:0.9
            }}
        />
    </Icons>
  )
}

export default SocialIcons