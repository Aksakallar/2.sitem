import React, { useState, useEffect } from "react";
import styled from "styled-components";
import img from "../assets/Images/Kitaplar.jpg";
import { motion } from "framer-motion";

import SocialIcon from "../subComponents/SocialIcons";
import PowerButton from "../subComponents/PowerButton";
import LogoComponent from "../subComponents/LogoComponent";
import AnaTitle from "../subComponents/AnaTitle";

import { Blogs } from "../data/BlogData";
import BlogPageCom from "./BlogPageCom";

import KancaSup from "../subComponents/KancaSup";

const MainContainer = styled(motion.div)`
  background-image: url(${img});
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
`;

const Container = styled.div`
  background-color: ${(props) => `rgba(${props.theme.bodyRgba}, 0.85)`};
  width: 100%;
  min-height: 100vh;
  position: relative;
  padding-bottom: 2rem;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 10rem 2rem 4rem 2rem;
  min-height: calc(100vh - 6rem);

  @media screen and (max-width: 768px) {
    padding: 8rem 1rem 4rem 1rem;
    min-height: calc(100vh - 4rem);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 2rem;
  max-width: 1200px;
  width: 100%;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-gap: 1.5rem;
    max-width: 400px;
  }

  @media screen and (max-width: 480px) {
    max-width: 320px;
  }
`;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,

    transition: {
      staggerChildren: 0.5,
      duration: 0.5,
    },
  },
};

const BlogPage = () => {
  const [numbers, setNumbers] = useState(0);

  useEffect(() => {
    let num = (window.innerHeight - 70) / 30;
    setNumbers(parseInt(num));
  }, []);

  return (
    <MainContainer
      variants={container}
      initial="hidden"
      animate="show"
      exit={{
        opacity: 0,
        transition: { duration: 0.5 },
      }}
    >
      <Container>
        <LogoComponent />
        <PowerButton />
        <SocialIcon />
        <KancaSup numbers={numbers} />

        <Center>
          <Grid>
            {Blogs.map((blog) => {
              return <BlogPageCom key={blog.id} blog={blog} />;
            })}
          </Grid>
        </Center>
        <AnaTitle text="Blog" top="5rem" left="5rem" />
      </Container>
    </MainContainer>
  );
};

export default BlogPage;
