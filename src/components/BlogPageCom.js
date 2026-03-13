import React from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import styled from "styled-components";
import { motion } from "framer-motion";

// ─── Tag renk paleti ──────────────────────────────────────────────────────────
const TAG_PALETTE = {
  React:            { bg: "rgba(97,218,251,0.15)",  border: "#61DAFB", color: "#0ea5e9" },
  SASS:             { bg: "rgba(204,102,153,0.15)", border: "#CC6699", color: "#CC6699" },
  "UI Design":      { bg: "rgba(255,107,107,0.15)", border: "#FF6B6B", color: "#e11d48" },
  HTML:             { bg: "rgba(227,79,38,0.15)",   border: "#E34F26", color: "#E34F26" },
  CSS:              { bg: "rgba(21,114,182,0.15)",  border: "#1572B6", color: "#1572B6" },
  JavaScript:       { bg: "rgba(247,223,30,0.15)",  border: "#c9a800", color: "#92680a" },
  "C#":             { bg: "rgba(104,33,122,0.15)",  border: "#68217A", color: "#a855f7" },
  Shopify:          { bg: "rgba(150,191,72,0.15)",  border: "#96BF48", color: "#4a7c00" },
  Figma:            { bg: "rgba(242,78,30,0.15)",   border: "#F24E1E", color: "#F24E1E" },
  "Design Thinking":{ bg: "rgba(139,92,246,0.15)",  border: "#8B5CF6", color: "#7c3aed" },
  TypeScript:       { bg: "rgba(49,120,198,0.15)",  border: "#3178C6", color: "#3178C6" },
  "Node.js":        { bg: "rgba(104,160,99,0.15)",  border: "#68A063", color: "#3d6b39" },
  Python:           { bg: "rgba(55,118,171,0.15)",  border: "#3776AB", color: "#3776AB" },
};

const getTagStyle = (tag) =>
  TAG_PALETTE[tag] || {
    bg: "rgba(107,114,128,0.12)",
    border: "#6B7280",
    color: "#6B7280",
  };

// ─── Okuma süresi (dakika) ────────────────────────────────────────────────────
const calcReadingTime = (html = "") => {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

// ─── Styled Components ────────────────────────────────────────────────────────
const Container = styled(motion.div)`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Box = styled(motion(NavLink))`
  width: 100%;
  max-width: 350px;
  min-width: 280px;
  text-decoration: none;
  color: ${(props) => props.theme.text};
  background: ${(props) => `rgba(${props.theme.bodyRgba}, 0.55)`};
  border: 1.5px solid ${(props) => `rgba(${props.theme.textRgba}, 0.18)`};
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
  z-index: 5;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.28);
    border-color: ${(props) => `rgba(${props.theme.textRgba}, 0.45)`};
  }

  @media screen and (max-width: 768px) {
    max-width: 280px;
    min-width: 220px;
  }

  @media screen and (max-width: 480px) {
    max-width: 260px;
    min-width: 200px;
  }
`;

const Image = styled.div`
  background-image: ${(props) => `url(${props.img})`};
  width: 100%;
  height: 185px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  transition: transform 0.35s ease;

  ${Box}:hover & {
    transform: scale(1.04);
  }

  @media screen and (max-width: 768px) {
    height: 150px;
  }
`;

const ImageWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  flex-shrink: 0;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem 1.2rem 1.1rem 1.2rem;
  gap: 0.55rem;

  @media screen and (max-width: 768px) {
    padding: 0.85rem 1rem 0.9rem 1rem;
  }
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.18rem 0.62rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border: 1px solid ${(props) => props.$border};
  background: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  transition: opacity 0.2s;

  ${Box}:hover & {
    opacity: 0.9;
  }
`;

const Title = styled.h3`
  color: inherit;
  font-family: "Karla", sans-serif;
  font-weight: 700;
  font-size: 1.05rem;
  line-height: 1.35;
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${(props) => `rgba(${props.theme.textRgba}, 0.15)`};
  margin: 0;
`;

const Summary = styled.p`
  color: ${(props) => `rgba(${props.theme.textRgba}, 0.72)`};
  font-size: 0.84rem;
  line-height: 1.55;
  margin: 0;

  /* Otomatik 3 satır kırpma */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  ${Box}:hover & {
    color: ${(props) => `rgba(${props.theme.textRgba}, 0.88)`};
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.5rem;
  gap: 0.5rem;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
`;

const DateText = styled.span`
  font-size: 0.76rem;
  color: ${(props) => `rgba(${props.theme.textRgba}, 0.6)`};
  font-weight: 500;
`;

const ReadTime = styled.span`
  font-size: 0.76rem;
  color: ${(props) => `rgba(${props.theme.textRgba}, 0.6)`};
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const ReadMore = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${(props) => `rgba(${props.theme.textRgba}, 0.55)`};
  border: 1.5px solid ${(props) => `rgba(${props.theme.textRgba}, 0.2)`};
  border-radius: 8px;
  padding: 0.28rem 0.7rem;
  white-space: nowrap;
  transition: color 0.22s ease, border-color 0.22s ease, background 0.22s ease;

  ${Box}:hover & {
    color: ${(props) => props.theme.body};
    background: ${(props) => props.theme.text};
    border-color: ${(props) => props.theme.text};
  }
`;

// ─── Framer Motion ────────────────────────────────────────────────────────────
const Item = {
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", duration: 0.5 },
  },
};

// ─── Bileşen ──────────────────────────────────────────────────────────────────
const BlogPageCom = ({ blog }) => {
  const { id, name, tags, date, imgSrc, description = "", summary } = blog;
  const readMin = calcReadingTime(description);

  return (
    <Container variants={Item}>
      <Box to={`/blog/${id}`}>
        <ImageWrapper>
          <Image img={imgSrc} />
        </ImageWrapper>

        <CardBody>
          {/* Kategori etiketleri */}
          <TagRow>
            {tags.map((tag, i) => {
              const style = getTagStyle(tag);
              return (
                <Tag key={i} $bg={style.bg} $border={style.border} $color={style.color}>
                  {tag}
                </Tag>
              );
            })}
          </TagRow>

          {/* Başlık */}
          <Title>{name}</Title>

          <Divider />

          {/* Özet — otomatik 3 satırda kesilir */}
          <Summary>{summary || description.replace(/<[^>]+>/g, " ").slice(0, 300)}</Summary>

          {/* Alt bilgi */}
          <Footer>
            <MetaInfo>
              <DateText>📅 {date}</DateText>
              <ReadTime>⏱ {readMin} dk okuma</ReadTime>
            </MetaInfo>
            <ReadMore>Devamını Oku →</ReadMore>
          </Footer>
        </CardBody>
      </Box>
    </Container>
  );
};

export default BlogPageCom;
