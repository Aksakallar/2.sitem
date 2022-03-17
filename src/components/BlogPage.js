import React,{useState, useEffect}from 'react'
import styled from 'styled-components'
import img from '../assets/Images/Kitaplar.jpg'
import {motion} from 'framer-motion';

import SocialIcon from '../subComponents/SocialIcons'
import PowerButton from '../subComponents/PowerButton'
import LogoComponent from '../subComponents/LogoComponent'
import AnaTitle from '../subComponents/AnaTitle'

import {Blogs} from '../data/BlogData';
import BlogPageCom from './BlogPageCom'

import KancaSup from '../subComponents/KancaSup'



const MainContainer = styled(motion.div)`

  background-image: url(${img});
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed; 
  background-position: center;
  width: 100vw;
 
`
  const Container = styled.div`
    background-color: ${props => `rgba(${props.theme.bodyRgba}, 0.8)`};
    width: 100%;
    height: auto;
    position: relative;
     
  `
  const Center = styled.div`
  
    display: flex;
    justify-content: center; 
    align-items: center;
    padding-top: 10rem;
  `
  const Grid = styled.div`
  
    display: grid; 
    grid-template-columns: repeat(2, minmax(calc(10rem + 15vw), 1fr));
    grid-gap: calc(1rem + 2vw);

    @media screen and (max-width: 800px) {
      
      grid-template-columns: repeat(1, minmax(calc(10rem + 15vw), 1fr));

      
    }

  `

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




const BlogPage = () => {

  const [numbers, setNumbers] = useState(0);

  useEffect(() => {
    let num = (window.innerHeight- 70) / 30;
    setNumbers(parseInt(num))
  }, [])

  return (
    <MainContainer
      variants={container}
      initial='hidden'
      animate='show'
      exit={{
        opacity:0, transition:{duration:0.5}
      }}
    >
      <Container>
          <LogoComponent/>
          <PowerButton />
          <SocialIcon/>
          <KancaSup numbers= {numbers} />

          <Center>
            <Grid>
              
            {
                Blogs.map(blog =>{
                  return <BlogPageCom key={blog.id} blog={blog} />
                })
              }  

            </Grid>
          </Center>
          <AnaTitle text="Blog" top="5rem" left="5rem"/>
      </Container>    
    </MainContainer>
  )
}

export default BlogPage