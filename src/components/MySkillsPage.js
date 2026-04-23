import React, { useEffect, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { lightTheme } from './Themes';
import { motion, AnimatePresence } from 'framer-motion';
import LogoComponent from '../subComponents/LogoComponent';
import PowerButton from '../subComponents/PowerButton';
import SocialIcons from '../subComponents/SocialIcons';
import CellComponent from '../subComponents/CellComponent';
import AnaTitle from '../subComponents/AnaTitle';
import { fetchServices, fetchAvailability, createAppointment, subscribeNewsletter } from '../config/api';

// ─── Styled Components ────────────────────────────────────────────────────────

const Box = styled.div`
  background-color: ${props => props.theme.body};
  width: 100vw;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 7rem 2rem 4rem;

  @media screen and (max-width: 900px) {
    padding: 6rem 1rem 4rem;
  }
`

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1000px;
  margin-top: 2rem;
  z-index: 3;

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    max-width: 420px;
  }
`

const ServiceCard = styled(motion.div)`
  background: #ffffff;
  border: 2px solid ${props => props.theme.text};
  border-radius: 16px;
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  z-index: 3;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: background 0.3s, color 0.3s, box-shadow 0.3s;

  &:hover {
    background: ${props => props.theme.text};
    color: ${props => props.theme.body};
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  }
`

const ServiceTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  font-family: 'Karla', sans-serif;
`

const ServiceDesc = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 0;
  flex: 1;
`

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`

const Price = styled.span`
  color: ${props => props.theme.text};
  font-size: 1.4rem;
  font-weight: 700;
`

const PriceSub = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.78rem;
`

const FreeBadge = styled.span`
  display: inline-block;
  background: rgba(50, 160, 80, 0.12);
  border: 1px solid rgba(50, 160, 80, 0.35);
  color: #2a8a4a;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
`

const BookBtn = styled.button`
  background: ${props => props.theme.text};
  color: ${props => props.theme.body};
  border: none;
  border-radius: 8px;
  padding: 0.65rem 1rem;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  width: 100%;
  font-family: 'Karla', sans-serif;

  &:hover { opacity: 0.8; }
`

const InfoNote = styled.p`
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.75rem;
  text-align: center;
  margin: 0;
  z-index: 3;
`

// ─── Modal ────────────────────────────────────────────────────────────────────

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const Modal = styled(motion.div)`
  background: #1a1a2e;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-height: 90vh;
  overflow-y: auto;
`

const ModalTitle = styled.h2`
  color: white;
  font-size: 1.1rem;
  margin: 0;
  font-family: 'Karla', sans-serif;
`

const Label = styled.label`
  color: rgba(255,255,255,0.7);
  font-size: 0.82rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

const Input = styled.input`
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
  color: white;
  font-size: 0.88rem;
  outline: none;
  &:focus { border-color: rgba(255,255,255,0.4); }
`

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`

const Slot = styled.button`
  background: ${props => props.selected ? 'white' : 'rgba(255,255,255,0.07)'};
  color: ${props => props.selected ? '#1a1a2e' : 'white'};
  border: 1px solid ${props => props.selected ? 'white' : 'rgba(255,255,255,0.2)'};
  border-radius: 6px;
  padding: 0.4rem 0.2rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: rgba(255,255,255,0.5); }
`

const ModalActions = styled.div`
  display: flex;
  gap: 0.8rem;
`

const CancelBtn = styled.button`
  flex: 1;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: white;
  padding: 0.65rem;
  font-size: 0.86rem;
  cursor: pointer;
  &:hover { border-color: rgba(255,255,255,0.5); }
`

const ConfirmBtn = styled.button`
  flex: 2;
  background: white;
  border: none;
  border-radius: 8px;
  color: #1a1a2e;
  padding: 0.65rem;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

const SuccessBox = styled(motion.div)`
  text-align: center;
  color: white;
  padding: 1rem 0;
  h3 { font-size: 1.1rem; margin: 0.5rem 0; }
  p  { color: rgba(255,255,255,0.6); font-size: 0.85rem; margin: 0; }
`

const ErrorMsg = styled.p`
  color: #ff7070;
  font-size: 0.82rem;
  margin: 0;
`

const NoSlots = styled.p`
  color: rgba(255,255,255,0.4);
  font-size: 0.84rem;
  margin: 0;
`

const gridVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

// ─── Bileşen ──────────────────────────────────────────────────────────────────

const MySkillsPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [chosenSlot, setChosenSlot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [subEmail, setSubEmail] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [subMsg, setSubMsg] = useState('');

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openModal = (svc) => {
    setSelected(svc);
    setStep('form');
    setName(''); setEmail(''); setPhone(''); setDate('');
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
    if (!name.trim() || !email.trim() || !phone.trim() || !chosenSlot) {
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
        customerPhone: phone.trim(),
        scheduledAt,
        durationMinutes: selected.durationMinutes ?? 60,
      });
      setSuccessMsg(result.message || 'Randevunuz alındı!');
      setStep('success');
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <ThemeProvider theme={lightTheme}>
      <Box>
        <LogoComponent theme='light' />
        <PowerButton />
        <SocialIcons theme='light' />
        <CellComponent theme='light' />

        {loading ? (
          <Grid style={{ marginTop: '2rem' }}>
            {[1, 2, 3].map(i => (
              <ServiceCard key={i} style={{ minHeight: 200, background: 'rgba(0,0,0,0.04)' }} />
            ))}
          </Grid>
        ) : (
          <Grid>
            {services.map(svc => (
              <ServiceCard key={svc.id}>
                <ServiceTitle>{svc.title}</ServiceTitle>
                {svc.description && <ServiceDesc>{svc.description}</ServiceDesc>}
                <PriceRow>
                  <Price>{svc.price} {svc.currency || 'EUR'}</Price>
                  {svc.durationMinutes && <PriceSub>/ {svc.durationMinutes} dk</PriceSub>}
                </PriceRow>
                <BookBtn onClick={() => openModal(svc)}>Randevu Al</BookBtn>
              </ServiceCard>
            ))}
          </Grid>
        )}

        <InfoNote style={{ marginTop: '2rem' }}>
          Pazartesi – Cuma · 09:00 – 20:00 · 7/24 mesaj bırakabilirsiniz
        </InfoNote>

        {/* Newsletter Signup */}
        <div style={{
          marginTop: '2rem', zIndex: 3, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '0.6rem', width: '100%', maxWidth: 400,
        }}>
          <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.8rem', margin: 0, textAlign: 'center' }}>
            Güncellemelerden haberdar ol — bültene abone ol
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
            <input
              type="email"
              value={subEmail}
              onChange={e => setSubEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              style={{
                flex: 1, padding: '0.55rem 0.9rem', borderRadius: '8px',
                border: '1.5px solid rgba(0,0,0,0.2)', background: '#fff',
                fontSize: '0.85rem', outline: 'none', color: '#333',
              }}
            />
            <button
              disabled={subLoading || !subEmail.trim()}
              onClick={async () => {
                if (!subEmail.trim()) return;
                setSubLoading(true); setSubMsg('');
                try {
                  const res = await subscribeNewsletter(subEmail.trim());
                  setSubMsg(res.message || 'Abone oldunuz!');
                  setSubEmail('');
                } catch (e) {
                  setSubMsg(e.message);
                } finally {
                  setSubLoading(false);
                }
              }}
              style={{
                padding: '0.55rem 1rem', borderRadius: '8px', border: 'none',
                background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: '0.82rem',
                fontWeight: 600, cursor: subLoading || !subEmail.trim() ? 'not-allowed' : 'pointer',
                opacity: subLoading || !subEmail.trim() ? 0.5 : 1,
              }}
            >
              {subLoading ? '...' : 'Abone Ol'}
            </button>
          </div>
          {subMsg && (
            <p style={{ color: subMsg.includes('Hata') || subMsg.includes('başarısız') ? '#c0392b' : '#2a8a4a', fontSize: '0.78rem', margin: 0 }}>
              {subMsg}
            </p>
          )}
        </div>

        <AnaTitle text="My Skills" top="80%" right="30%" />
      </Box>

      <AnimatePresence>
        {selected && (
          <Overlay
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                <SuccessBox initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ fontSize: '2.5rem' }}>✅</div>
                  <h3>Randevunuz Alındı!</h3>
                  <p>{successMsg}</p>
                  <BookBtn style={{ marginTop: '1.5rem', background: 'white', color: '#1a1a2e' }} onClick={closeModal}>
                    Kapat
                  </BookBtn>
                </SuccessBox>
              ) : (
                <>
                  <ModalTitle>Randevu Al — {selected.title}</ModalTitle>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem' }}>
                    {selected.price} {selected.currency || 'EUR'}
                    {selected.durationMinutes && ` · ${selected.durationMinutes} dk`}
                  </div>
                  <Label>
                    Adınız Soyadınız
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Mehmet Asker" />
                  </Label>
                  <Label>
                    E-posta
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@email.com" />
                  </Label>
                  <Label>
                    Telefon Numarası
                    <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+90 555 000 00 00" />
                  </Label>
                  <Label>
                    Tarih Seçin
                    <Input type="date" value={date} min={today} onChange={e => handleDateChange(e.target.value)} />
                  </Label>
                  {date && (
                    <div>
                      <Label as="p" style={{ marginBottom: '0.6rem' }}>Müsait Saatler</Label>
                      {slotsLoading ? (
                        <NoSlots>Yükleniyor...</NoSlots>
                      ) : slots.length === 0 ? (
                        <NoSlots>Bu tarihte müsait saat yok.</NoSlots>
                      ) : (
                        <SlotGrid>
                          {slots.map(slot => (
                            <Slot key={slot} selected={chosenSlot === slot} onClick={() => setChosenSlot(slot)}>
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
                    <ConfirmBtn onClick={handleSubmit} disabled={submitting || !chosenSlot || !name || !email || !phone}>
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
  )
}

export default MySkillsPage