import React, { useEffect, useState, useRef } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { DarkTheme } from './Themes';
import { motion } from 'framer-motion';
import LogoComponent from '../subComponents/LogoComponent';
import PowerButton from '../subComponents/PowerButton';
import SocialIcons from '../subComponents/SocialIcons';
import CellComponent from '../subComponents/CellComponent';
import AnaTitle from '../subComponents/AnaTitle';
import { fetchTracks } from '../config/api';

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
`

const TabRow = styled.div`
  display: flex;
  gap: 0.5rem;
  z-index: 3;
  margin-bottom: 1rem;
`

const Tab = styled.button`
  background: ${props => props.active ? props.theme.text : 'transparent'};
  color: ${props => props.active ? props.theme.body : props.theme.text};
  border: 1px solid ${props => props.theme.text};
  border-radius: 20px;
  padding: 0.35rem 1rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Karla', sans-serif;
  transition: all 0.2s;
`

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 700px;
  z-index: 3;
`

const TrackCard = styled(motion.div)`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255,255,255,0.09);
  }
`

const Cover = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img { width: 100%; height: 100%; object-fit: cover; }
`

const TrackInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const TrackTitle = styled.div`
  color: white;
  font-size: 0.92rem;
  font-weight: 600;
  font-family: 'Karla', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TrackMeta = styled.div`
  color: rgba(255,255,255,0.45);
  font-size: 0.78rem;
  margin-top: 0.2rem;
`

const Duration = styled.div`
  color: rgba(255,255,255,0.4);
  font-size: 0.78rem;
  flex-shrink: 0;
`

const PlayerBar = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(10,10,20,0.95);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255,255,255,0.1);
  padding: 0.75rem 1.5rem;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 1rem;
`

const PlayBtn = styled.button`
  background: white;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 0.9rem;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
`

const ProgressWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

const ProgressBar = styled.div`
  height: 4px;
  background: rgba(255,255,255,0.15);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
`

const ProgressFill = styled.div`
  height: 100%;
  background: white;
  border-radius: 2px;
  width: ${props => props.pct}%;
  transition: width 0.2s linear;
`

const NowPlaying = styled.div`
  color: white;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: 'Karla', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`

const TimeInfo = styled.div`
  color: rgba(255,255,255,0.4);
  font-size: 0.72rem;
  display: flex;
  justify-content: space-between;
`

const EmptyMsg = styled.p`
  color: rgba(255,255,255,0.3);
  font-size: 0.9rem;
  z-index: 3;
  margin-top: 2rem;
`

// ─── Yardımcı Fonksiyonlar ────────────────────────────────────────────────────

function fmt(secs) {
  if (!secs) return '0:00';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ─── Bileşen ──────────────────────────────────────────────────────────────────

const MusicPage = () => {
  const [tab, setTab] = useState('Music');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetchTracks(tab)
      .then(setTracks)
      .catch(() => setTracks([]))
      .finally(() => setLoading(false));
  }, [tab]);

  const playTrack = (track) => {
    if (current?.id === track.id) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play();
        setPlaying(true);
      }
      return;
    }
    setCurrent(track);
    setProgress(0);
    setPlaying(true);
  };

  useEffect(() => {
    if (!current || !audioRef.current) return;
    audioRef.current.src = current.audioUrl;
    audioRef.current.play().catch(() => setPlaying(false));
  }, [current]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  };

  const handleEnded = () => {
    setPlaying(false);
    setProgress(0);
  };

  const currentTime = audioRef.current?.currentTime ?? 0;
  const duration = audioRef.current?.duration ?? 0;

  return (
    <ThemeProvider theme={DarkTheme}>
      <Box>
        <LogoComponent theme='dark' />
        <PowerButton />
        <SocialIcons theme='dark' />
        <CellComponent theme='dark' />

        <TabRow>
          <Tab active={tab === 'Music'} onClick={() => setTab('Music')}>Müzik</Tab>
          <Tab active={tab === 'Podcast'} onClick={() => setTab('Podcast')}>Podcast</Tab>
        </TabRow>

        <TrackList>
          {loading ? (
            <EmptyMsg>Yükleniyor...</EmptyMsg>
          ) : tracks.length === 0 ? (
            <EmptyMsg>Henüz {tab === 'Music' ? 'müzik' : 'podcast'} yok.</EmptyMsg>
          ) : (
            tracks.map((t) => (
              <TrackCard
                key={t.id}
                onClick={() => playTrack(t)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{ border: current?.id === t.id ? '1px solid rgba(255,255,255,0.35)' : undefined }}
              >
                <Cover>
                  {t.coverUrl
                    ? <img src={t.coverUrl} alt={t.title} />
                    : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.4rem' }}>
                        {tab === 'Music' ? '🎵' : '🎙️'}
                      </span>
                  }
                </Cover>
                <TrackInfo>
                  <TrackTitle>{t.title}</TrackTitle>
                  <TrackMeta>
                    {t.artist && `${t.artist} · `}
                    {t.type === 'Podcast' && t.episodeNumber ? `Bölüm ${t.episodeNumber}` : ''}
                  </TrackMeta>
                </TrackInfo>
                <Duration>{fmt(t.durationSeconds)}</Duration>
                {current?.id === t.id && (
                  <span style={{ color: 'white', fontSize: '0.8rem' }}>
                    {playing ? '⏸' : '▶'}
                  </span>
                )}
              </TrackCard>
            ))
          )}
        </TrackList>

        <AnaTitle text={tab === 'Music' ? 'MUSIC' : 'PODCAST'} top="10%" right="20%" />
      </Box>

      {/* Gizli audio elementi */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Player bar */}
      {current && (
        <PlayerBar
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PlayBtn onClick={() => { playing ? audioRef.current.pause() : audioRef.current.play(); }}>
            {playing ? '⏸' : '▶'}
          </PlayBtn>
          <ProgressWrap>
            <NowPlaying>{current.title}</NowPlaying>
            <ProgressBar onClick={handleSeek}>
              <ProgressFill pct={progress} />
            </ProgressBar>
            <TimeInfo>
              <span>{fmt(Math.floor(currentTime))}</span>
              <span>{fmt(Math.floor(duration))}</span>
            </TimeInfo>
          </ProgressWrap>
        </PlayerBar>
      )}
    </ThemeProvider>
  );
};

export default MusicPage;
