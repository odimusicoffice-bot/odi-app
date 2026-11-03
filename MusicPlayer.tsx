import { ChevronDown, Heart, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { formatTime, PLAYER_DURATION, usePlayer } from '@/context/PlayerContext';

function PlayPauseButton({ large = false }: { large?: boolean }) {
  const { isPlaying, togglePlay } = usePlayer();
  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        togglePlay();
      }}
      aria-label={isPlaying ? 'Pause' : 'Play'}
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-white transition-all hover:scale-105 hover:bg-[#2563EB] ${large ? 'h-16 w-16' : 'h-11 w-11'}`}
    >
      {isPlaying ? (
        <Pause size={large ? 22 : 16} fill="currentColor" strokeWidth={0} />
      ) : (
        <Play size={large ? 22 : 16} fill="currentColor" strokeWidth={0} className="ml-0.5" />
      )}
    </button>
  );
}

export default function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    isExpanded,
    progress,
    likedTrackIds,
    toggleExpand,
    collapse,
    next,
    prev,
    toggleLike,
  } = usePlayer();

  if (!currentTrack) return null;

  const progressPercent = Math.min((progress / PLAYER_DURATION) * 100, 100);
  const isLiked = likedTrackIds.includes(currentTrack.id);
  const marqueeTitle = `${currentTrack.title} · ${currentTrack.title} · `;

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0A0A0A] text-white animate-fade-overlay">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.16),transparent_42%)]" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 pb-12 pt-7 sm:px-10">
          <div className="flex items-center justify-between">
            <button
              onClick={collapse}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-xl transition-colors hover:bg-white/10"
              aria-label="Collapse player"
            >
              <ChevronDown size={22} strokeWidth={1.75} />
            </button>
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#888888]">Now Playing</span>
            <button
              onClick={toggleLike}
              className={`flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-xl transition-colors ${isLiked ? 'border-[#3B82F6]/50 bg-[#3B82F6]/15 text-[#3B82F6]' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart size={19} fill={isLiked ? 'currentColor' : 'none'} strokeWidth={1.75} />
            </button>
          </div>

          <div className="my-auto flex flex-col items-center py-12">
            <div className="w-full max-w-[min(78vw,390px)] overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
              <img src={currentTrack.cover} alt={currentTrack.title} className="aspect-square w-full rounded-[22px] object-cover" />
            </div>
            <div className="mt-8 w-full">
              <h1 className="font-anton text-4xl uppercase leading-none tracking-wide text-white sm:text-5xl">{currentTrack.title}</h1>
              <p className="mt-3 text-base text-[#888888]">{currentTrack.artist}</p>
            </div>

            <div className="mt-9 w-full">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[#3B82F6] transition-[width] duration-1000" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-[11px] tabular-nums text-[#666666]">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(PLAYER_DURATION)}</span>
              </div>
            </div>

            <div className="mt-8 flex w-full items-center justify-center gap-9">
              <button onClick={prev} aria-label="Previous track" className="text-white transition-colors hover:text-[#3B82F6]"><SkipBack size={23} fill="currentColor" strokeWidth={0} /></button>
              <PlayPauseButton large />
              <button onClick={next} aria-label="Next track" className="text-white transition-colors hover:text-[#3B82F6]"><SkipForward size={23} fill="currentColor" strokeWidth={0} /></button>
            </div>
          </div>
          <div className="text-center text-[10px] uppercase tracking-[0.25em] text-[#444444]">ODI LABS</div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleExpand}
      className="fixed left-1/2 top-[76px] z-[90] flex w-[calc(100%-32px)] max-w-[460px] -translate-x-1/2 items-center gap-3 rounded-[24px] border border-white/15 bg-[#111111]/90 p-2.5 text-left shadow-[0_14px_45px_rgba(0,0,0,0.45)] backdrop-blur-2xl animate-slide-down sm:top-[88px]"
      aria-label="Open music player"
    >
      <img src={currentTrack.cover} alt="" className="h-11 w-11 shrink-0 rounded-[15px] object-cover" />
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="overflow-hidden whitespace-nowrap text-sm font-medium text-white">
          <div className={`inline-flex min-w-full ${currentTrack.title.length > 17 ? 'animate-marquee' : ''}`}>
            <span className="shrink-0">{marqueeTitle}</span>
            {currentTrack.title.length > 17 && <span className="shrink-0">{marqueeTitle}</span>}
          </div>
        </div>
        <p className="mt-0.5 truncate text-[11px] text-[#777777]">{currentTrack.artist}</p>
      </div>
      <span onClick={(event) => event.stopPropagation()}><PlayPauseButton /></span>
    </button>
  );
}
