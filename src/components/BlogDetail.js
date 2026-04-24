import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

import img from "../assets/Images/Kitaplar.jpg";
import SocialIcon from "../subComponents/SocialIcons";
import PowerButton from "../subComponents/PowerButton";
import LogoComponent from "../subComponents/LogoComponent";
import { useBlogDetail } from "../hooks/useBlogApi";
import { fetchPublicComments, createComment } from "../config/api";

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
  background-color: ${(props) => `rgba(${props.theme.bodyRgba}, 0.9)`};
  width: 100%;
  min-height: 100vh;
  position: relative;
  padding-bottom: 2rem;
`;

const BlogContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 8rem 2rem 4rem 2rem;
  min-height: calc(100vh - 6rem);

  @media screen and (max-width: 768px) {
    padding: 6rem 1rem 4rem 1rem;
  }
`;

const BlogContent = styled.div`
  max-width: 800px;
  width: 100%;
  background-color: ${(props) => `rgba(${props.theme.bodyRgba}, 0.8)`};
  backdrop-filter: blur(10px);
  border: 2px solid ${(props) => props.theme.text};
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.3);

  @media screen and (max-width: 768px) {
    padding: 1.5rem;
    margin: 0 1rem;
  }
`;

const BlogHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${(props) => props.theme.text};
  padding-bottom: 1.5rem;
`;

const BlogTitle = styled.h1`
  color: ${(props) => props.theme.text};
  font-family: "Karla", sans-serif;
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 1rem;
  line-height: 1.3;

  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const BlogMeta = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  @media screen and (max-width: 768px) {
    gap: 1rem;
    flex-direction: column;
  }
`;

const BlogDate = styled.span`
  color: ${(props) => props.theme.text};
  font-size: 1rem;
  font-weight: 500;

  @media screen and (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const BlogTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Tag = styled.span`
  background-color: ${(props) => props.theme.text};
  color: ${(props) => props.theme.body};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;

  @media screen and (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.25rem 0.6rem;
  }
`;

const BlogImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 2rem;
  border: 1px solid ${(props) => props.theme.text};
`;

const BlogBody = styled.div`
  color: ${(props) => props.theme.text};
  line-height: 1.8;
  font-size: 1rem;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${(props) => props.theme.text};
    margin: 1.5rem 0 1rem 0;
    font-family: "Karla", sans-serif;
    font-weight: 700;
  }

  h3 {
    font-size: 1.4rem;
    border-bottom: 1px solid ${(props) => props.theme.text};
    padding-bottom: 0.5rem;
  }

  p {
    margin-bottom: 1.2rem;
    text-align: justify;
  }

  ul,
  ol {
    margin: 1rem 0;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.8rem;
  }

  strong {
    font-weight: 700;
    color: ${(props) => props.theme.text};
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
    border: 1px solid ${(props) => props.theme.text};
  }

  @media screen and (max-width: 768px) {
    font-size: 0.95rem;
    line-height: 1.7;

    h3 {
      font-size: 1.2rem;
    }

    ul,
    ol {
      padding-left: 1.5rem;
    }
  }
`;

const BackButton = styled(motion.button)`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background-color: ${(props) => props.theme.text};
  color: ${(props) => props.theme.body};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  z-index: 10;

  &:hover {
    background-color: ${(props) => props.theme.body};
    color: ${(props) => props.theme.text};
    border: 2px solid ${(props) => props.theme.text};
  }

  @media screen and (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
  }
`;

const NotFound = styled.div`
  text-align: center;
  color: ${(props) => props.theme.text};
  font-size: 1.5rem;
  margin-top: 4rem;
`;

const CommentsSection = styled.div`
  margin-top: 2.5rem;
  border-top: 2px solid ${(props) => props.theme.text};
  padding-top: 1.5rem;
`;

const CommentTitle = styled.h3`
  color: ${(props) => props.theme.text};
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  font-family: 'Karla', sans-serif;
`;

const CommentItem = styled.div`
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding: 0.9rem 0;
  &:last-of-type { border-bottom: none; }
`;

const CommentAuthor = styled.span`
  color: ${(props) => props.theme.text};
  font-weight: 600;
  font-size: 0.9rem;
`;

const CommentDate = styled.span`
  color: rgba(255,255,255,0.4);
  font-size: 0.78rem;
  margin-left: 0.6rem;
`;

const CommentText = styled.p`
  color: ${(props) => props.theme.text};
  font-size: 0.88rem;
  line-height: 1.6;
  margin: 0.3rem 0 0;
  opacity: 0.85;
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const CommentInput = styled.input`
  background: rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.18);
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
  color: ${(props) => props.theme.text};
  font-size: 0.88rem;
  outline: none;
  &:focus { border-color: rgba(0,0,0,0.5); background: rgba(0,0,0,0.05); }
  &::placeholder { color: rgba(0,0,0,0.4); }
`;

const CommentTextarea = styled.textarea`
  background: rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.18);
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
  color: ${(props) => props.theme.text};
  font-size: 0.88rem;
  outline: none;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  &:focus { border-color: rgba(0,0,0,0.5); background: rgba(0,0,0,0.05); }
  &::placeholder { color: rgba(0,0,0,0.4); }
`;

const CommentSubmitBtn = styled.button`
  background: ${(props) => props.theme.text};
  color: ${(props) => props.theme.body};
  border: none;
  border-radius: 8px;
  padding: 0.65rem 1.5rem;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  transition: opacity 0.2s;
  &:hover { opacity: 0.8; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const CommentMsg = styled.p`
  font-size: 0.82rem;
  margin: 0;
  color: ${(props) => props.success ? '#4ade80' : '#f87171'};
`;

const BlogDetail = () => {
  const { id } = useParams();
  const { blog, loading } = useBlogDetail(id);

  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentMsg, setCommentMsg] = useState(null); // { text, success }

  useEffect(() => {
    if (!id) return;
    fetchPublicComments(id).then(setComments).catch(() => {});
  }, [id]);

  if (loading) {
    return (
      <MainContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Container>
          <LogoComponent />
          <PowerButton />
          <SocialIcon />
          <BlogContainer>
            <NotFound>Yükleniyor...</NotFound>
          </BlogContainer>
        </Container>
      </MainContainer>
    );
  }

  if (!blog) {
    return (
      <MainContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container>
          <LogoComponent />
          <PowerButton />
          <SocialIcon />
          <BlogContainer>
            <NotFound>Blog bulunamadı!</NotFound>
          </BlogContainer>
        </Container>
      </MainContainer>
    );
  }

  return (
    <MainContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container>
        <LogoComponent />
        <PowerButton />
        <SocialIcon />

        <BackButton
          onClick={() => window.history.back()}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ← Geri Dön
        </BackButton>

        <BlogContainer>
          <BlogContent>
            <BlogHeader>
              <BlogTitle>{blog.name}</BlogTitle>
              <BlogMeta>
                <BlogDate>{blog.date}</BlogDate>
                <BlogTags>
                  {blog.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </BlogTags>
              </BlogMeta>
            </BlogHeader>

            {blog.imgSrc && <BlogImage src={blog.imgSrc} alt={blog.name} />}

            {blog.description && (
              <BlogBody
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
            )}

            <CommentsSection>
              <CommentTitle>Yorumlar ({comments.length})</CommentTitle>
              {comments.length === 0 && (
                <CommentText style={{ opacity: 0.4 }}>Henüz yorum yok. İlk yorumu sen yaz!</CommentText>
              )}
              {comments.map((c) => (
                <CommentItem key={c.id}>
                  <CommentAuthor>{c.authorName}</CommentAuthor>
                  <CommentDate>{new Date(c.createdAt).toLocaleDateString('tr-TR')}</CommentDate>
                  <CommentText>{c.content}</CommentText>
                </CommentItem>
              ))}

              <CommentForm onSubmit={async (e) => {
                e.preventDefault();
                if (!commentName.trim() || !commentEmail.trim() || !commentText.trim()) return;
                setCommentSubmitting(true);
                setCommentMsg(null);
                try {
                  await createComment({ postId: id, authorName: commentName.trim(), authorEmail: commentEmail.trim(), content: commentText.trim() });
                  setCommentMsg({ text: 'Yorumunuz incelemeye alındı, teşekkürler!', success: true });
                  setCommentName(''); setCommentEmail(''); setCommentText('');
                } catch (err) {
                  setCommentMsg({ text: err.message, success: false });
                } finally {
                  setCommentSubmitting(false);
                }
              }}>
                <CommentTitle style={{ marginBottom: 0 }}>Yorum Yaz</CommentTitle>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <CommentInput style={{ flex: 1, minWidth: 140 }} placeholder="Adınız *" value={commentName} onChange={(e) => setCommentName(e.target.value)} required />
                  <CommentInput style={{ flex: 1, minWidth: 140 }} type="email" placeholder="E-posta *" value={commentEmail} onChange={(e) => setCommentEmail(e.target.value)} required />
                </div>
                <CommentTextarea placeholder="Yorumunuz *" value={commentText} onChange={(e) => setCommentText(e.target.value)} required />
                {commentMsg && <CommentMsg success={commentMsg.success}>{commentMsg.text}</CommentMsg>}
                <CommentSubmitBtn type="submit" disabled={commentSubmitting}>
                  {commentSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                </CommentSubmitBtn>
              </CommentForm>
            </CommentsSection>
          </BlogContent>
        </BlogContainer>
      </Container>
    </MainContainer>
  );
};

export default BlogDetail;
