import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Upload, Check } from 'lucide-react';

interface AuditionsPageProps {
  onBack: () => void;
}

type Tab = 'odi-a' | 'global';

const globalCasting = [
  { name: 'SM Entertainment', country: 'South Korea', url: 'https://audition.smentertainment.com' },
  { name: 'JYP Entertainment', country: 'South Korea', url: 'https://www.jypaudition.com' },
  { name: 'HYBE Labels', country: 'Global', url: 'https://audition.hybecorp.com' },
  { name: 'YG Entertainment', country: 'South Korea', url: 'https://yg-audition.com' },
  { name: 'Avex', country: 'Japan', url: 'https://www.avex-audition.com' },
  { name: '4Nologue', country: 'Thailand', url: 'https://www.4nologue.com' },
];

export default function AuditionsPage({ onBack }: AuditionsPageProps) {
  const [tab, setTab] = useState<Tab>('odi-a');

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] px-6 pb-28 pt-8 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={onBack}
          className="mb-10 flex items-center gap-2 text-sm text-[#888888] transition-colors hover:text-white"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
          Back
        </button>

        <h1 className="font-anton text-5xl uppercase leading-none text-white sm:text-6xl">
          Auditions
        </h1>

        {/* Tab switcher */}
        <div className="mt-6 flex gap-2">
          <TabButton active={tab === 'odi-a'} onClick={() => setTab('odi-a')}>
            ODI A
          </TabButton>
          <TabButton active={tab === 'global'} onClick={() => setTab('global')}>
            Global
          </TabButton>
        </div>

        <div className="mt-6">
          {tab === 'odi-a' ? <OdiAForm /> : <GlobalList />}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition-all sm:flex-none sm:px-8 ${
        active
          ? 'bg-[#3B82F6] text-white'
          : 'border border-[#222222] bg-[#141414] text-[#888888] hover:text-white hover:border-[#333333]'
      }`}
    >
      {children}
    </button>
  );
}

function OdiAForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasOriginals, setHasOriginals] = useState<'yes' | 'no' | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [toast, setToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToast(true);
    setTimeout(() => setToast(false), 3500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Name / Alias">
        <input
          type="text"
          placeholder="Your stage name or real name"
          className="w-full rounded-xl border border-[#222222] bg-[#0F0F0F] px-4 py-3 text-base text-white placeholder:text-[#444444] focus:border-[#3B82F6] focus:outline-none"
        />
      </Field>

      <Field label="Age">
        <input
          type="number"
          min={13}
          max={99}
          placeholder="Your age"
          className="w-full rounded-xl border border-[#222222] bg-[#0F0F0F] px-4 py-3 text-base text-white placeholder:text-[#444444] focus:border-[#3B82F6] focus:outline-none"
        />
      </Field>

      <Field label="Do you have original works?">
        <div className="flex gap-3">
          <ToggleButton
            active={hasOriginals === 'yes'}
            onClick={() => setHasOriginals('yes')}
          >
            Yes
          </ToggleButton>
          <ToggleButton
            active={hasOriginals === 'no'}
            onClick={() => setHasOriginals('no')}
          >
            No
          </ToggleButton>
        </div>
      </Field>

      <Field label="Social Links">
        <input
          type="text"
          placeholder="Instagram / TikTok / YouTube"
          className="w-full rounded-xl border border-[#222222] bg-[#0F0F0F] px-4 py-3 text-base text-white placeholder:text-[#444444] focus:border-[#3B82F6] focus:outline-none"
        />
      </Field>

      <Field label="Upload Skills (Audio/Video)">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#333333] bg-[#0F0F0F] px-4 py-6 transition-colors hover:border-[#3B82F6]/50"
        >
          <Upload size={22} strokeWidth={1.5} className="text-[#555555]" />
          <p className="mt-2 text-sm text-white">
            {fileName ?? 'Tap to attach a file'}
          </p>
          <p className="mt-1 text-xs text-[#555555]">
            Max size: 50MB. Show us your best 1-minute demo.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setFileName(f.name);
            }}
          />
        </div>
      </Field>

      <button
        type="submit"
        className="mt-2 w-full rounded-full bg-[#3B82F6] py-4 text-sm font-semibold text-white transition-all hover:bg-[#2563EB] hover:shadow-lg hover:shadow-[#3B82F6]/30"
      >
        Submit Request
      </button>

      {toast && (
        <div className="fixed bottom-28 left-1/2 z-[3000] -translate-x-1/2 rounded-full border border-[#3B82F6]/40 bg-[#111111]/95 px-6 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-xl animate-fade-up">
          Your application has been sent to ODI LABS
        </div>
      )}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wider text-[#666666]">{label}</label>
      {children}
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all sm:flex-none sm:px-8 ${
        active
          ? 'border-[#3B82F6] bg-[#3B82F6]/15 text-[#3B82F6]'
          : 'border-[#222222] bg-[#0F0F0F] text-[#888888] hover:text-white hover:border-[#333333]'
      }`}
    >
      {active && <Check size={14} strokeWidth={2.5} />}
      {children}
    </button>
  );
}

function GlobalList() {
  return (
    <div className="flex flex-col gap-2">
      {globalCasting.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 rounded-2xl border border-[#222222] bg-[#141414] px-4 py-3.5 transition-all hover:border-[#3B82F6]/50 hover:bg-[#161616]"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{item.name}</p>
            <p className="mt-0.5 text-xs text-[#666666]">{item.country}</p>
          </div>
          <ArrowRight
            size={16}
            strokeWidth={2}
            className="shrink-0 text-[#555555] transition-colors group-hover:text-[#3B82F6]"
          />
        </a>
      ))}
    </div>
  );
}
