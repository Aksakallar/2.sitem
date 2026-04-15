import React, { useEffect, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { lightTheme } from './Themes';
import { Design } from './AllSvgs';
import LogoComponent from '../subComponents/LogoComponent';
import PowerButton from '../subComponents/PowerButton';
import SocialIcons from '../subComponents/SocialIcons';
import CellComponent from '../subComponents/CellComponent';
import AnaTitle from '../subComponents/AnaTitle';
import { fetchSkills } from '../config/api';

const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const FALLBACK_SKILLS = [
  { name: "HTML",       iconUrl: `${CDN}/html5/html5-original.svg` },
  { name: "CSS",        iconUrl: `${CDN}/css3/css3-original.svg` },
  { name: "JavaScript", iconUrl: `${CDN}/javascript/javascript-original.svg` },
  { name: "React",      iconUrl: `${CDN}/react/react-original.svg` },
  { name: "C#",         iconUrl: `${CDN}/csharp/csharp-original.svg` },
  { name: "Next.js",    iconUrl: `${CDN}/nextjs/nextjs-original.svg` },
  { name: "SASS",       iconUrl: `${CDN}/sass/sass-original.svg` },
  { name: "Figma",      iconUrl: `${CDN}/figma/figma-original.svg` },
  { name: "GitHub",     iconUrl: `${CDN}/github/github-original.svg` },
];

// ─── Styled Components ────────────────────────────────────────────────────────
const Box = styled.div`
  background-color: ${props => props.theme.body};
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  @media screen and (max-width: 900px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    padding: 6rem 1rem 4rem;
    gap: 1.5rem;
    justify-content: flex-start;
  }
`

const Panel = styled.div`
  border: 2px solid ${props => props.theme.text};
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.body};
  padding: 2rem;
  width: 28vw;
  height: 60vh;
  z-index: 3;
  font-family: 'Ubuntu Mono', monospace;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    color: ${props => props.theme.body};
    background-color: ${props => props.theme.text};
  }

  @media screen and (max-width: 900px) {
    width: 80vw;
    height: auto;
    padding: 1.2rem;
  }
`

const Title = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: calc(1em + 0.8vw);
  gap: 0.6rem;

  ${Panel}:hover & > * {
    fill: ${props => props.theme.body};
  }

  @media screen and (max-width: 900px) {
    font-size: 1.1rem;
  }
`

const Description = styled.div`
  color: inherit;
  font-size: calc(0.6em + 0.7vw);
  padding: 0.4rem 0;
  line-height: 1.6;

  strong {
    display: block;
    margin-bottom: 0.4rem;
    text-transform: uppercase;
  }
  ul {
    margin-left: 1.5rem;
  }

  @media screen and (max-width: 900px) {
    font-size: 0.85rem;
  }
`

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem 0.5rem;
  width: 100%;
  flex: 1;
  align-content: center;
`

const TechTile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
`

const TechIcon = styled.img`
  width: 42px;
  height: 42px;
  transition: transform 0.2s ease, filter 0.2s ease;

  &:hover {
    transform: translateY(-4px) scale(1.12);
    filter: drop-shadow(0 6px 10px rgba(0,0,0,0.25));
  }

  @media screen and (max-width: 900px) {
    width: 36px;
    height: 36px;
  }
`

const TechLabel = styled.span`
  font-size: 0.58rem;
  font-family: 'Ubuntu Mono', monospace;
  color: inherit;
  text-align: center;
  opacity: 0.75;
  white-space: nowrap;
`

// ─── Bileşen ──────────────────────────────────────────────────────────────────
const MySkillsPage = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchSkills().then(data => {
      if (data && data.length > 0) setSkills(data);
      else setSkills(FALLBACK_SKILLS);
    });
  }, []);

  const displaySkills = skills.length > 0 ? skills : FALLBACK_SKILLS;

  return (
    <ThemeProvider theme={lightTheme}>
      <Box>
        <LogoComponent theme='light' />
        <PowerButton />
        <SocialIcons theme='light' />
        <CellComponent theme='light' />

        {/* Designer Paneli */}
        <Panel>
          <Title>
            <Design width={30} height={30} /> Designer
          </Title>

          <Description>
            I enjoy learning and creating purposeful designs in my free time, focusing on clarity rather than complexity.
          </Description>

          <Description>
            <strong>I'm interested in</strong>
            <ul>
              <li>Simple & functional websites</li>
              <li>Clean social media visuals</li>
              <li>Practical digital tools</li>
            </ul>
          </Description>
        </Panel>

        {/* Tech Stack Paneli */}
        <Panel>
          <Title>⚙ Tech Stack</Title>
          <TechGrid>
            {displaySkills.map((skill, i) => (
              <TechTile key={skill.id || i}>
                {skill.iconUrl
                  ? <TechIcon src={skill.iconUrl} alt={skill.name} />
                  : <TechIcon src={`${CDN}/${skill.name.toLowerCase()}/${skill.name.toLowerCase()}-original.svg`} alt={skill.name} />
                }
                <TechLabel>{skill.name}</TechLabel>
              </TechTile>
            ))}
          </TechGrid>
        </Panel>

        <AnaTitle text="My Skills" top="80%" right="30%" />
      </Box>
    </ThemeProvider>
  )
}

export default MySkillsPage
