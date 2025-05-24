import React from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled(motion.div)``;

const Box = styled(motion(NavLink))`
  width: 100%;
  max-width: 350px;
  min-width: 280px;
  text-decoration: none;
  height: auto;
  min-height: 400px;
  margin: 0;
  padding: 1.5rem;
  color: ${(props) => props.theme.text};
  border: 2px solid ${(props) => props.theme.text};
  backdrop-filter: blur(10px);
  box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.9);
  cursor: pointer;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  z-index: 5;

  &:hover {
    color: ${(props) => props.theme.body};
    background-color: ${(props) => props.theme.text};
    transition: all 0.3s ease;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    min-width: 250px;
    min-height: 350px;
    padding: 1rem;
  }

  @media screen and (max-width: 480px) {
    min-width: 200px;
    padding: 0.8rem;
  }
`;

const Image = styled.div`
  background-image: ${(props) => `url(${props.img})`};
  width: 100%;
  height: 180px;
  background-size: cover;
  border: 1px solid transparent;
  background-position: center center;
  border-radius: 8px;
  flex-shrink: 0;

  ${Box}:hover & {
    border: 1px solid ${(props) => props.theme.body};
  }

  @media screen and (max-width: 768px) {
    height: 150px;
  }
`;

const Title = styled.h3`
  color: inherit;
  padding: 1rem 0 0.5rem 0;
  font-family: "Karla", sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  line-height: 1.3;
  border-bottom: 1px solid ${(props) => props.theme.text};
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;

  ${Box}:hover & {
    border-bottom: 1px solid ${(props) => props.theme.body};
  }

  @media screen and (max-width: 768px) {
    font-size: 1rem;
    padding: 0.8rem 0 0.4rem 0;
  }
`;

const Hashtags = styled.div`
  padding: 0.5rem 0;
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`;

const Tag = styled.span`
  font-size: 0.85rem;
  word-break: break-all;

  @media screen and (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Date = styled.span`
  padding: 0.5rem 0 0 0;
  font-size: 0.9rem;
  margin-top: auto;

  @media screen and (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

//Framer-motion Yapılandırması
const Item = {
  hidden: {
    scale: 0,
  },
  show: {
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5,
    },
  },
};

const BlogPageCom = (props) => {
  const { id, name, tags, date, imgSrc } = props.blog;
  return (
    <Container variants={Item}>
      <Box to={`/blog/${id}`}>
        <Image img={imgSrc} />
        <Title>{name}</Title>
        <Hashtags>
          {tags.map((t, index) => {
            return <Tag key={index}>#{t}</Tag>;
          })}
        </Hashtags>
        <Date>{date}</Date>
      </Box>
    </Container>
  );
};

export default BlogPageCom;
