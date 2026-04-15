import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import {  Twitter, Facebook, Instagram} from '../components/AllSvgs'
import {DarkTheme} from "../components/Themes";
import { motion } from 'framer-motion'
import { fetchSocialLinks } from '../config/api'

const ICON_MAP = { Twitter, Facebook, Instagram };

const DEFAULT_LINKS = [
  { platform: 'Facebook', url: 'https://www.facebook.com/profile.php?id=717434260' },
  { platform: 'Twitter', url: 'https://twitter.com/MehmetAsker10' },
  { platform: 'Instagram', url: 'https://www.instagram.com/m3hm3t_ask3r/' },
];



const Icons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => props.theme.text};
  position: fixed;
  bottom: 0;
  left: 2rem;

  z-index: 3;

  & > *:not(:last-child) {
    margin: 0.5rem 0;
  }
  @media screen and (max-width: 480px) {
    left: 1rem;
  }
  @media screen and (max-width: 800px) {
    ${props => props.click && `
      svg path {
        fill: ${DarkTheme.body} !important;
      }
    `}
  }
`;
 const Line = styled(motion.span)`

    width: 2px;
    height: 8rem;
    background-color: ${props => props.color === "dark" ?  DarkTheme.text : DarkTheme.body };

    @media screen and (max-width: 800px) {
      background-color: ${props => props.click ? DarkTheme.body : (props.color === "dark" ? DarkTheme.text : DarkTheme.body)};
    }
 `


const SocialIcons = (props) => {
  const [links, setLinks] = useState(DEFAULT_LINKS);

  useEffect(() => {
    fetchSocialLinks()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLinks(data.filter(l => l.isVisible !== false));
        }
      })
      .catch(() => {});
  }, []);

  const fill = props.theme === "dark" ? DarkTheme.text : DarkTheme.body;

  return (
    <Icons click={props.click}>
      {links.map((link, i) => {
        const Icon = ICON_MAP[link.platform];
        if (!Icon) return null;
        return (
          <motion.div
            key={link.platform}
            initial={{transition:"scale(0)"}}
            animate={{scale:[0,1,1.5,1]}}
            transition={{type:'spring', duration:1, delay: 1 + i * 0.2}}
          >
            <NavLink style={{color:'inherit'}} target="_blank" to={{pathname: link.url}}>
              <Icon width={25} height={25} fill={fill} />
            </NavLink>
          </motion.div>
        );
      })}

      <Line color={props.theme} click={props.click}
        initial={{ height:0 }}
        animate={{ height:'8rem' }}
        transition={{ type:'spring', duration:1, delay:0.9 }}
      />
    </Icons>
  );
}

export default SocialIcons