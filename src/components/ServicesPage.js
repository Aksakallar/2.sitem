import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider, keyframes } from 'styled-components';
import { DarkTheme } from './Themes';
import { motion, AnimatePresence } from 'framer-motion';

import LogoComponent from '../subComponents/LogoComponent';
import PowerButton from '../subComponents/PowerButton';
import SocialIcons from '../subComponents/SocialIcons';
import AnaTitle from '../subComponents/AnaTitle';

import { fetchServices, fetchAvailability, createAppointment } from '../config/api';

// ─── Styled Components ───────────────────────────────────────────────────────

const Box = styled.div`
  background-color: ${props => props.theme.body};
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 7rem 2rem 4rem;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1100px;
  margin-top: 2rem;

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    max-width: 460px;
  }
`;

const shimmer = keyframes`
  0%   { background-position: -400px 0 }
  100% { background-position: 400px 0 }
`;

const ServiceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: pointer;
  transition: border-color 0.3s, background 0.3s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.35);
    background: rgba(255, 255, 255, 0.07);
  }
`;

const ServiceTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
`;

const ServiceDesc = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.88rem;
  line-height: 1.6;
  margin: 0;
  flex: 1;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

const Price = styled.span`
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  font-weight: 700;
`;

const PriceSub = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
`;

const FreeBadge = styled.span`
  display: inline-block;
  background: rgba(100, 200, 120, 0.15);
  border: 1px solid rgba(100, 200, 120, 0.4);
  color: #7dde8a;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  letter-spacing: 0.03em;
`;

const BookBtn = styled.button`
  background: ${props => props.theme.text};
  color: ${props => props.theme.body};
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  width: 100%;

  &:hover { opacity: 0.85; }
`;

const InfoNote = styled.p`
  color: rgba(255,255,255,0.35);
  font-size: 0.78rem;
  text-align: center;
  margin: 0;
`;

// ─── Modal ────────────────────────────────────────────────────────────────────

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: #1a1a2e;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  color: white;
  font-size: 1.15rem;
  margin: 0;
`;

const Label = styled.label`
  color: rgba(255,255,255,0.7);
  font-size: 0.82rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Input = styled.input`
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
  color: white;
  font-size: 0.9rem;
  outline: none;

  &:focus { border-color: rgba(255,255,255,0.4); }
`;

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

const Slot = styled.button`
  background: ${props => props.selected ? 'white' : 'rgba(255,255,255,0.07)'};
  color: ${props => props.selected ? '#1a1a2e' : 'white'};
  border: 1px solid ${props => props.selected ? 'white' : 'rgba(255,255,255,0.2)'};
  border-radius: 6px;
  padding: 0.45rem 0.2rem;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: rgba(255,255,255,0.5); }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const CancelBtn = styled.button`
  flex: 1;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: white;
  padding: 0.7rem;
  font-size: 0.88rem;
  cursor: pointer;

  &:hover { border-color: rgba(255,255,255,0.5); }
`;

const ConfirmBtn = styled.button`
  flex: 2;
  background: white;
  border: none;
  border-radius: 8px;
  color: #1a1a2e;
  padding: 0.7rem;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const SuccessBox = styled(motion.div)`
  text-align: center;
  color: white;
  padding: 1rem 0;

  h3 { font-size: 1.1rem; margin: 0.5rem 0; }
  p  { color: rgba(255,255,255,0.6); font-size: 0.85rem; margin: 0; }
`;

const ErrorMsg = styled.p`
  color: #ff7070;
  font-size: 0.82rem;
  margin: 0;
`;

const NoSlots = styled.p`
  color: rgba(255,255,255,0.4);
  font-size: 0.85rem;
  margin: 0;
`;

// ─── Framer variants ──────────────────────────────────────────────────────────

const gridVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ─── Component ────────────────────────────────────────────────────────────────

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState('form'); // 'form' | 'slots' | 'success'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [chosenSlot, setChosenSlot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openModal = (service) => {
    setSelected(service);
    setStep('form');
    setName(''); setEmail(''); setDate('');
    setSlots([]); setChosenSlot('');
    setError(''); setSuccessMsg('');
  };

  const closeModal = () => setSelected(null);

  const handleDateChange = async (val) => {
    setDate(val);
    setChosenSlot('');
    setSlots([]);
    if (!val || !selected) return;
    setSlotsLoading(true);
    try {
      const available = await fetchAvailability(selected.id, val);
      setSlots(available);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !chosenSlot) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const scheduledAt = `${date}T${chosenSlot}:00`;
      const result = await createAppointment({
        serviceId: selected.id,
        customerName: name.trim(),
        customerEmail: email.trim(),
        scheduledAt,
        durationMinutes: selected.sessionDurationMinutes,
      });
      setSuccessMsg(result.message || 'Randevunuz alındı!');
      setStep('success');
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Min date = bugün
  const today = new Date().toISOString().split('T')[0];

  return (
    <ThemeProvider theme={DarkTheme}>
      <Box>
        <LogoComponent theme='dark' />
        <PowerButton />
        <SocialIcons theme='dark' />
        <AnaTitle text="HİZMETLER" top='10%' right="20%" />

        {loading ? (
          <Grid style={{ marginTop: '8rem' }}>
            {[1, 2, 3].map(i => (
              <ServiceCard key={i} style={{ minHeight: 220, background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </Grid>
        ) : (
          <Grid
            variants={gridVariants}
            initial="hidden"
            animate="show"
            style={{ marginTop: '6rem' }}
          >
            {services.map(svc => (
              <ServiceCard key={svc.id} variants={cardVariants}>
                <ServiceTitle>{svc.title}</ServiceTitle>
                {svc.description && <ServiceDesc>{svc.description}</ServiceDesc>}

                <PriceRow>
                  <Price>{svc.packagePriceEur} EUR</Price>
                  <PriceSub>/ {svc.packageHours} seans</PriceSub>
                </PriceRow>

                <InfoNote>
                  {svc.sessionDurationMinutes} dk · seans başına{' '}
                  {(svc.packagePriceEur / svc.packageHours).toFixed(0)} EUR
                </InfoNote>

                {svc.isFreeFirstSession && (
                  <FreeBadge>İlk seans ücretsiz</FreeBadge>
                )}

                <BookBtn onClick={() => openModal(svc)}>
                  Randevu Al
                </BookBtn>
              </ServiceCard>
            ))}
          </Grid>
        )}

        <InfoNote style={{ marginTop: '3rem', color: 'rgba(255,255,255,0.25)' }}>
          Pazartesi – Cuma · 09:00 – 20:00 · 7/24 mesaj bırakabilirsiniz
        </InfoNote>
      </Box>

      {/* ─── Modal ─── */}
      <AnimatePresence>
        {selected && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <Modal
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
            >
              {step === 'success' ? (
                <SuccessBox
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div style={{ fontSize: '2.5rem' }}>✅</div>
                  <h3>Randevunuz Alındı!</h3>
                  <p>{successMsg}</p>
                  <BookBtn style={{ marginTop: '1.5rem' }} onClick={closeModal}>
                    Kapat
                  </BookBtn>
                </SuccessBox>
              ) : (
                <>
                  <ModalTitle>Randevu Al — {selected.title}</ModalTitle>

                  {selected.isFreeFirstSession && (
                    <FreeBadge style={{ alignSelf: 'flex-start' }}>
                      İlk seans ücretsiz
                    </FreeBadge>
                  )}

                  <Label>
                    Adınız Soyadınız
                    <Input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Mehmet Asker"
                    />
                  </Label>

                  <Label>
                    E-posta
                    <Input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ornek@email.com"
                    />
                  </Label>

                  <Label>
                    Tarih Seçin
                    <Input
                      type="date"
                      value={date}
                      min={today}
                      onChange={e => handleDateChange(e.target.value)}
                    />
                  </Label>

                  {date && (
                    <div>
                      <Label as="p" style={{ marginBottom: '0.6rem' }}>
                        Müsait Saatler
                      </Label>
                      {slotsLoading ? (
                        <NoSlots>Yükleniyor...</NoSlots>
                      ) : slots.length === 0 ? (
                        <NoSlots>Bu tarihte müsait saat yok.</NoSlots>
                      ) : (
                        <SlotGrid>
                          {slots.map(slot => (
                            <Slot
                              key={slot}
                              selected={chosenSlot === slot}
                              onClick={() => setChosenSlot(slot)}
                            >
                              {slot}
                            </Slot>
                          ))}
                        </SlotGrid>
                      )}
                    </div>
                  )}

                  {error && <ErrorMsg>{error}</ErrorMsg>}

                  <ModalActions>
                    <CancelBtn onClick={closeModal}>İptal</CancelBtn>
                    <ConfirmBtn
                      onClick={handleSubmit}
                      disabled={submitting || !chosenSlot || !name || !email}
                    >
                      {submitting ? 'Gönderiliyor...' : 'Randevuyu Onayla'}
                    </ConfirmBtn>
                  </ModalActions>
                </>
              )}
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default ServicesPage;