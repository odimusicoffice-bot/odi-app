import { useState } from 'react';
import { ArrowLeft, Headphones, Heart, Music2, Pencil, Play, Youtube } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import DonateModal from '@/components/DonateModal';
import { usePlayer } from '@/context/PlayerContext';

interface ArtistProfilePageProps {
  onBack: () => void;
}

const ARTIST_NAME = 'ODI J';
const ARTIST_PHOTO = '/images/artists/IMG_0736.jpeg';
const glassCard = 'rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl';
const ODI_J_TRACK = {
  id: 101,
  title: 'ODI J — Untitled',
  artist: ARTIST_NAME,
  cover: ARTIST_PHOTO,
};

const streamingLinks = [
  { label: 'Spotify', icon: Headphones },
  { label: 'Apple Music', icon: Music2 },
  { label: 'YouTube', icon: Youtube },
];

export default function ArtistProfilePage({ onBack }: ArtistProfilePageProps) {
  const { isAdmin } = useAuth();
  const { playTrack } = usePlayer();
  const [following, setFollowing] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [storyExpanded, setStoryExpanded] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] pb-32 text-white">
      <button
        onClick={onBack}
        className="fixed left-6 top-8 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur-md transition-colors hover:bg-black/60 sm:left-10"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        Back
      </button>

      {isAdmin && (
        <button
          aria-label="Edit artist profile"
          className="fixed right-6 top-8 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 sm:right-10"
        >
          <Pencil size={16} strokeWidth={1.5} />
        </button>
      )}

      <div className="mx-auto max-w-2xl px-6 pb-8 pt-28 sm:px-10">
        <header className="flex flex-col items-center text-center">
          <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-[#C0C0C0] shadow-[0_0_24px_rgba(192,192,192,0.25)]">
            <img
              src={ARTIST_PHOTO}
              alt={ARTIST_NAME}
              className="h-full w-full object-cover"
              style={{ objectPosition: '50% 30%', filter: 'grayscale(100%) contrast(1.1)' }}
            />
          </div>
          <h1 className="mt-5 font-anton text-5xl uppercase leading-none text-white">{ARTIST_NAME}</h1>
          <span className="mt-3 rounded-full bg-[#3B82F6] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Artist
          </span>
        </header>

        <div className="mt-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-xl">
            <Play size={16} strokeWidth={1.75} className="text-[#3B82F6]" fill="currentColor" />
            <span className="font-anton text-xl text-white">0</span>
            <span className="text-xs uppercase tracking-wider text-[#888888]">Plays</span>
          </div>

          <div className="grid w-full grid-cols-2 gap-3">
            <button
              onClick={() => setFollowing((v) => !v)}
              className={`rounded-full py-3.5 text-sm font-semibold transition-all ${
                following
                  ? 'bg-[#3B82F6] text-white hover:bg-[#2563EB]'
                  : 'bg-white text-[#0A0A0A] hover:bg-gray-100'
              }`}
            >
              {following ? 'Following' : 'Follow'}
            </button>
            <button
              onClick={() => setDonateOpen(true)}
              className="flex items-center justify-center gap-2 rounded-full bg-[#3B82F6] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#2563EB]"
            >
              <Heart size={16} strokeWidth={1.75} />
              Donate
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <section className={`${glassCard} flex flex-col`}>
            <h2 className="text-xs uppercase tracking-wider text-[#888888]">Artist Story</h2>
            <p className="mt-3 text-sm leading-relaxed text-white">
              The heart of ODI LABS. Producer. Vocalist.
            </p>
            {storyExpanded && (
              <p className="mt-2 text-sm leading-relaxed text-[#888888]">
                The full story of ODI J is coming soon.
              </p>
            )}
            <button
              onClick={() => setStoryExpanded((v) => !v)}
              className="mt-auto pt-4 text-left text-xs font-semibold text-[#3B82F6] transition-colors hover:text-white"
            >
              {storyExpanded ? 'Show Less' : 'Read More'}
            </button>
          </section>

          <section className={`${glassCard} flex flex-col items-center`}>
            <h2 className="w-full text-xs uppercase tracking-wider text-[#888888]">Latest Release</h2>
            <div className="relative mt-4 aspect-square w-full max-w-[160px]">
              <div
                className="absolute inset-0 rounded-full border border-white/10 bg-[#0A0A0A] shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
                style={{
                  backgroundImage:
                    'repeating-radial-gradient(circle at center, #151515 0px, #151515 2px, #0A0A0A 3px, #0A0A0A 4px)',
                }}
              />
              <div className="absolute inset-[38%] rounded-full bg-[#3B82F6]" />
              <button
                onClick={() => playTrack(ODI_J_TRACK)}
                aria-label="Play latest release"
                className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0A0A0A] shadow-lg transition-transform hover:scale-110"
              >
                <Play size={14} strokeWidth={2} fill="currentColor" className="ml-0.5" />
              </button>
            </div>
            <p className="mt-4 text-xs text-[#888888]">No release yet</p>
          </section>

          <section className={`${glassCard} col-span-2 flex flex-col gap-3`}>
            <h2 className="text-xs uppercase tracking-wider text-[#888888]">Streaming Links</h2>
            <div className="flex flex-wrap gap-2">
              {streamingLinks.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
                >
                  <Icon size={16} strokeWidth={1.75} />
                  {label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <DonateModal open={donateOpen} artistName={ARTIST_NAME} onClose={() => setDonateOpen(false)} />
    </div>
  );
}
