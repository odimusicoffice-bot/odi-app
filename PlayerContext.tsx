import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';

export interface Track {
  id: number;
  title: string;
  artist: string;
  cover: string;
}

interface PlayerContextValue {
  currentTrack: Track | null;
  isPlaying: boolean;
  isExpanded: boolean;
  progress: number;
  likedTrackIds: number[];
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  toggleExpand: () => void;
  collapse: () => void;
  next: () => void;
  prev: () => void;
  toggleLike: () => void;
}

const TRACK_DURATION = 210; // 3:30 simulated

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [likedTrackIds, setLikedTrackIds] = useState<number[]>([]);
  const queueRef = useRef<Track[]>([]);

  useEffect(() => {
    if (!isPlaying || !currentTrack) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= TRACK_DURATION) {
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const playTrack = (track: Track, queue?: Track[]) => {
    if (queue && queue.length > 0) {
      queueRef.current = queue;
    } else if (queueRef.current.length === 0) {
      queueRef.current = [track];
    }
    setCurrentTrack(track);
    setProgress(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    setIsPlaying((v) => !v);
  };

  const toggleExpand = () => setIsExpanded((v) => !v);
  const collapse = () => setIsExpanded(false);

  const next = () => {
    if (!currentTrack || queueRef.current.length === 0) return;
    const idx = queueRef.current.findIndex((t) => t.id === currentTrack.id);
    const nextTrack = queueRef.current[(idx + 1) % queueRef.current.length];
    setCurrentTrack(nextTrack);
    setProgress(0);
    setIsPlaying(true);
  };

  const prev = () => {
    if (!currentTrack || queueRef.current.length === 0) return;
    const idx = queueRef.current.findIndex((t) => t.id === currentTrack.id);
    const prevTrack = queueRef.current[(idx - 1 + queueRef.current.length) % queueRef.current.length];
    setCurrentTrack(prevTrack);
    setProgress(0);
    setIsPlaying(true);
  };

  const toggleLike = () => {
    if (!currentTrack) return;
    setLikedTrackIds((ids) =>
      ids.includes(currentTrack.id)
        ? ids.filter((id) => id !== currentTrack.id)
        : [...ids, currentTrack.id]
    );
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isExpanded,
        progress,
        likedTrackIds,
        playTrack,
        togglePlay,
        toggleExpand,
        collapse,
        next,
        prev,
        toggleLike,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const PLAYER_DURATION = TRACK_DURATION;
