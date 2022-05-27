import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import Me from '../assets/Images/MehmetAsker.png'



const Kutu = styled(motion.div)`

    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    width: 55vw;
    height: 55vh;
    display: flex;

   
    background: linear-gradient(
        to right,
        ${props=> props.theme.body} 50%,
        ${props=> props.theme.text} 50%) bottom,
        linear-gradient(
        to right,
        ${props => props.theme.body} 50%,
        ${props => props.theme.text} 50%) top;

        background-repeat: no-repeat;
        background-size: 100% 2px;
        border-left: 2px solid ${props => props.theme.body};
        border-right: 2px solid ${props => props.theme.text};

    z-index: 1;

    @media screen and (max-width: 800px) {
      
    
        background: linear-gradient(
            to right,
            ${props=> props.theme.text} 50%,
            ${props=> props.theme.text} 50%) right,
            linear-gradient(
            to right,
            ${props => props.theme.text} 50%,
            ${props => props.theme.text} 50%) right;
    
            background-repeat: no-repeat;
            background-size: 100% 2px;
            border-left: 2px solid ${props => props.theme.text};
            border-right: 2px solid ${props => props.theme.body};

       }
    

`

const AltBox = styled.div`

    width: 50%;
    position: relative;
    display: flex;
  


.resim{
    position: absolute; 
    bottom: 1%;
    left: 50%;
    transform: translate(-50%, 0%);
    
    height: auto;
}


@media screen and (max-width: 800px) {
      
   .resim {
       left: 0;
       width:100%
   }
   width: 100%;
   flex-direction: column;
   justify-content: flex-start;
  }

 
  
`

const Text = styled.span`

font-size: calc(.8em + 1.5vw); 
color: ${props => props.theme.body};
padding: 2rem; 
cursor: pointer; 

display: flex;
flex-direction: column;
justify-content: space-evenly;


&>*:last-child{
    color: ${props => `rgba(${props.theme.bodyRgba},0.5)`};
    font-size: calc(0.5rem + 1.5vw);
    font-weight: 300;
}

@media screen and (max-width: 800px) {
    width: 100%;
    h3{
        margin-top: 1rem;
    }
    &>*:last-child{
        margin-top: 0.5rem;
        font-size: calc(0.5rem + 1.5vw);
    }


`

const Profil = () => {
  return (
    <Kutu initial={{height:0}} animate={{height:'55vh'}} transition={{type: 'spring', duration:2, delay:1 }}>

        <AltBox>
           <Text>
               <h1>Ola,</h1> 
               <h3> I'm Mehmet Asker</h3>
               <h6>I am increasing my experience and thus designing websites.</h6>
           </Text>
           
        </AltBox>
        <AltBox>
           <motion.div
           initial={{opacity:0}}
           animate={{opacity:1}}
           transition={{ duration:1, delay:2 }}           
           >
           <img className="resim" src={Me} alt='MY Profil'/>
           </motion.div>
        </AltBox>

    </Kutu>
  )
}

export default Profil