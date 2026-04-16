import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { submitContactMessage } from "../config/api";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled(motion.div)`
  background: ${(props) => props.theme.body};
  border: 2px solid ${(props) => props.theme.text};
  border-radius: 20px;
  padding: 2.5rem;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

  @media screen and (max-width: 500px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${(props) => props.theme.text};
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const Title = styled.h2`
  color: ${(props) => props.theme.text};
  font-family: "Karla", sans-serif;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;

  @media screen and (max-width: 500px) {
    font-size: 1.4rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Label = styled.label`
  color: ${(props) => props.theme.text};
  font-size: 0.9rem;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 2px solid ${(props) => props.theme.text};
  border-radius: 10px;
  font-size: 1rem;
  background: transparent;
  color: ${(props) => props.theme.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: ${(props) => props.theme.text};
    opacity: 0.5;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem 1rem;
  border: 2px solid ${(props) => props.theme.text};
  border-radius: 10px;
  font-size: 1rem;
  background: transparent;
  color: ${(props) => props.theme.text};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: ${(props) => props.theme.text};
    opacity: 0.5;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: ${(props) => props.theme.text};
  color: ${(props) => props.theme.body};
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled(motion.div)`
  text-align: center;
  color: ${(props) => props.theme.text};
  padding: 2rem;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    opacity: 0.8;
  }
`;

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API'ye kaydet
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      // FormSubmit.co ile e-posta bildirimi gönder (arka planda, hata olsa da devam et)
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("subject", formData.subject);
      fd.append("message", formData.message);
      fetch("https://formsubmit.co/aksaka7@gmail.com", {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      }).catch(() => {});

      setIsLoading(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
        onClose();
      }, 2000);
    } catch (error) {
      console.error("FAILED...", error);
      setIsLoading(false);
      alert("Message could not be sent. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>&times;</CloseButton>

            {isSubmitted ? (
              <SuccessMessage
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully!</p>
              </SuccessMessage>
            ) : (
              <>
                <Title>Get In Touch</Title>
                <Form onSubmit={handleSubmit}>
                  <InputGroup>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <Label>Subject</Label>
                    <Input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <Label>Message</Label>
                    <TextArea
                      name="message"
                      placeholder="Your message..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>

                  <SubmitButton
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </SubmitButton>
                </Form>
              </>
            )}
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
