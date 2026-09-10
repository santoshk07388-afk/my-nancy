import React, { useState, useEffect } from 'react';
import { MemoryPhoto, TimelineMilestone } from './types';
import { INITIAL_PHOTOS, INITIAL_TIMELINE } from './data/storyData';
import { LandingHero } from './components/LandingHero';
import { SectionApology } from './components/SectionApology';
import { SectionGallery } from './components/SectionGallery';
import { SectionTimeline } from './components/SectionTimeline';
import { SectionQualities } from './components/SectionQualities';
import { SectionStarlightCommitment } from './components/SectionStarlightCommitment';
import { SectionGlowingRoad } from './components/SectionGlowingRoad';
import { SectionLetter } from './components/SectionLetter';
import { SectionEnding } from './components/SectionEnding';
import { AudioPlayer } from './components/AudioPlayer';
import { PhotoCustomizerModal } from './components/PhotoCustomizerModal';
import { QRCodeModal } from './components/QRCodeModal';
import { PasscodeLockScreen } from './components/PasscodeLockScreen';
import { GlowingParticleCanvas } from './components/GlowingParticleCanvas';
import { Heart, Sliders, QrCode, ShieldCheck } from 'lucide-react';

export function App() {
  // Load initial photos from localStorage if customized
  const [photos, setPhotos] = useState<MemoryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('our_story_photos_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PHOTOS;
  });

  // Load timeline milestones from localStorage if customized
  const [timeline, setTimeline] = useState<TimelineMilestone[]>(() => {
    try {
      const saved = localStorage.getItem('our_story_timeline_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TIMELINE;
  });

  // Modal states
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);

  // Privacy & Access Control
  const [passcodeEnabled, setPasscodeEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('our_story_pass_enabled');
      if (saved !== null) return JSON.parse(saved);
    } catch {}
    return false; // Default: instant direct access for Nancy
  });

  const [passcode, setPasscode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('our_story_passcode');
      if (saved) return saved;
    } catch {}
    return '1402'; // Romantic default passcode (Valentine's Day)
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    // Check if secret key in URL or unlocked in session
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('key') || urlParams.has('direct') || urlParams.get('for') === 'nancy') {
        return true;
      }
      try {
        const sessionUnlocked = sessionStorage.getItem('our_story_unlocked');
        if (sessionUnlocked === 'true') return true;
      } catch {}
    }
    return false;
  });

  // Initial cloud sync: Load server-persisted photos, timeline & settings
  useEffect(() => {
    // 1. Fetch cloud photos
    fetch('/api/photos')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (data?.photos && Array.isArray(data.photos) && data.photos.length > 0) {
          setPhotos(data.photos);
          try {
            localStorage.setItem('our_story_photos_v1', JSON.stringify(data.photos));
          } catch {
            // storage full or blocked
          }
        }
      })
      .catch((_) => {
        // Fallback to local storage photos
      });

    // 2. Fetch cloud timeline
    fetch('/api/timeline')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (data?.timeline && Array.isArray(data.timeline) && data.timeline.length > 0) {
          setTimeline(data.timeline);
          try {
            localStorage.setItem('our_story_timeline_v1', JSON.stringify(data.timeline));
          } catch {}
        }
      })
      .catch((_) => {});

    // 3. Fetch cloud site settings
    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (data?.settings) {
          if (typeof data.settings.passcodeEnabled === 'boolean') {
            setPasscodeEnabled(data.settings.passcodeEnabled);
          }
          if (data.settings.passcode) {
            setPasscode(data.settings.passcode);
          }
        }
      })
      .catch((_) => {});
  }, []);

  // Sync state to localStorage & Server
  const handleSavePhotos = async (newPhotos: MemoryPhoto[]) => {
    setPhotos(newPhotos);
    try {
      localStorage.setItem('our_story_photos_v1', JSON.stringify(newPhotos));
    } catch (err) {
      console.warn('Unable to save to localStorage:', err);
    }

    try {
      await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos: newPhotos }),
      });
    } catch (err) {
      console.warn('Unable to persist photos to server:', err);
    }
  };

  const handleSaveTimeline = async (newTimeline: TimelineMilestone[]) => {
    setTimeline(newTimeline);
    try {
      localStorage.setItem('our_story_timeline_v1', JSON.stringify(newTimeline));
    } catch (err) {
      console.warn('Unable to save to localStorage:', err);
    }

    try {
      await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeline: newTimeline }),
      });
    } catch (err) {
      console.warn('Unable to persist timeline to server:', err);
    }
  };

  const handleUpdateLastPhoto = async (newPhotoUrl: string) => {
    if (photos.length === 0) return;
    const updated = [...photos];
    const lastIndex = updated.length - 1;
    updated[lastIndex] = {
      ...updated[lastIndex],
      url: newPhotoUrl,
    };
    await handleSavePhotos(updated);
  };

  const handleTogglePasscode = async (enabled: boolean) => {
    setPasscodeEnabled(enabled);
    try {
      localStorage.setItem('our_story_pass_enabled', JSON.stringify(enabled));
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { passcodeEnabled: enabled, passcode } }),
      });
    } catch (err) {
      console.warn('Unable to update settings:', err);
    }
  };

  const handleChangePasscode = async (newPass: string) => {
    setPasscode(newPass);
    try {
      localStorage.setItem('our_story_passcode', newPass);
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { passcodeEnabled, passcode: newPass } }),
      });
    } catch (err) {
      console.warn('Unable to update passcode:', err);
    }
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    try {
      sessionStorage.setItem('our_story_unlocked', 'true');
    } catch {
      // ignore
    }
  };

  const handleUpdateMilestone = (
    id: string,
    newDate: string,
    newCaption: string,
    newPhotoUrl?: string,
    newTitle?: string
  ) => {
    const updated = timeline.map((m) =>
      m.id === id
        ? {
            ...m,
            date: newDate,
            caption: newCaption,
            ...(newPhotoUrl ? { photoUrl: newPhotoUrl } : {}),
            ...(newTitle ? { title: newTitle } : {}),
          }
        : m
    );
    handleSaveTimeline(updated);
  };

  const handleResetDefaults = async () => {
    setPhotos(INITIAL_PHOTOS);
    setTimeline(INITIAL_TIMELINE);
    try {
      localStorage.removeItem('our_story_photos_v1');
      localStorage.removeItem('our_story_timeline_v1');
      await fetch('/api/photos', { method: 'DELETE' });
      await fetch('/api/timeline', { method: 'DELETE' });
    } catch (err) {
      console.warn('Failed to clear storage:', err);
    }
  };

  const handleOpenStory = () => {
    const apologyEl = document.getElementById('apology-section');
    if (apologyEl) {
      apologyEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If passcode protection is active and user hasn't entered passcode or used key URL
  if (passcodeEnabled && !isUnlocked) {
    return <PasscodeLockScreen correctPasscode={passcode} onUnlock={handleUnlock} />;
  }

  return (
    <div className="relative min-h-screen bg-[#110509] text-[#f7f0e8] overflow-x-hidden selection:bg-[#961c3c] selection:text-white">
      {/* Subtle Background Floating Particles */}
      <GlowingParticleCanvas />

      {/* Discreet Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#14060b]/80 backdrop-blur-md border-b border-pink-500/10 px-3 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-400 fill-pink-500" />
          <span className="font-serif-cormorant text-lg sm:text-xl font-medium tracking-wide text-rose-100">
            For Nancy
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-pink-300/80 bg-pink-950/40 border border-pink-500/20 px-2 py-0.5 rounded-full ml-1 font-sans-clean">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Private Link</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* QR Code & Link Button */}
          <button
            onClick={() => setIsQROpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/15 hover:bg-pink-500/25 text-pink-200 text-xs font-sans-clean border border-pink-400/30 transition backdrop-blur-sm cursor-pointer shadow-[0_0_15px_rgba(244,114,182,0.15)]"
            title="Get Website QR Code and Private Link for Nancy"
          >
            <QrCode className="w-3.5 h-3.5 text-pink-300" />
            <span className="font-medium">QR Code & Link</span>
          </button>

          {/* Personalize Photos Button */}
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 hover:text-pink-200 text-xs font-sans-clean border border-white/10 transition backdrop-blur-sm cursor-pointer"
            title="Upload your real couple photos"
          >
            <Sliders className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Change Pictures</span>
            <span className="sm:hidden">Pics</span>
          </button>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10 pt-10">
        {/* Landing Screen */}
        <LandingHero photos={photos} onOpenStory={handleOpenStory} />

        {/* Section 1: "Before Anything Else..." */}
        <SectionApology />

        {/* Section 2: "But Then I Remember Us" (Cinematic Gallery with 16:9 Finale) */}
        <SectionGallery
          photos={photos}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
        />

        {/* Section 3: Interactive Memory Timeline with 16:9 widescreen images */}
        <SectionTimeline
          timeline={timeline}
          onUpdateMilestone={handleUpdateMilestone}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
        />

        {/* Section 4: "What I Love About You" */}
        <SectionQualities />

        {/* Section 5: "I Don't Want To Lose Us" */}
        <SectionStarlightCommitment />

        {/* Section 6: "If We Get Another Chapter..." */}
        <SectionGlowingRoad />

        {/* Section 7: The Letter ("A Letter I Couldn't Say Properly") with Keepsake Photo */}
        <SectionLetter photo={photos[photos.length > 1 ? photos.length - 2 : 0]} />

        {/* Final Section with 16:9 Featured Last Picture */}
        <SectionEnding
          photos={photos}
          onOpenQR={() => setIsQROpen(true)}
          onUpdateLastPhoto={handleUpdateLastPhoto}
        />
      </main>

      {/* Floating Audio Player Widget */}
      <AudioPlayer onOpenCustomizer={() => setIsCustomizerOpen(true)} />

      {/* Personalize Photos & Audio Modal */}
      <PhotoCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        photos={photos}
        timeline={timeline}
        onSavePhotos={handleSavePhotos}
        onSaveTimeline={handleSaveTimeline}
        onResetDefaults={handleResetDefaults}
      />

      {/* QR Code & Share Modal */}
      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        passcodeEnabled={passcodeEnabled}
        passcode={passcode}
        onTogglePasscode={handleTogglePasscode}
        onChangePasscode={handleChangePasscode}
      />

      {/* Footer Note */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-stone-500 font-sans-clean bg-[#0c0306] px-4 space-y-2">
        <div className="flex items-center justify-center gap-1.5 mb-1 flex-wrap">
          <span>Made for Nancy with sincerity, patience & love, by Santosh</span>
          <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
        </div>
        <div className="flex items-center justify-center gap-3 text-[11px] text-stone-400">
          <button
            onClick={() => setIsQROpen(true)}
            className="inline-flex items-center gap-1 text-pink-400 hover:text-pink-300 underline cursor-pointer"
          >
            <QrCode className="w-3 h-3" />
            <span>Scan QR Code to open on phone</span>
          </button>
          <span>•</span>
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="text-stone-400 hover:text-pink-300 underline cursor-pointer"
          >
            Change Pictures
          </button>
        </div>
        <p className="text-[11px] text-stone-600">
          Private website • Only opens via direct secret link or QR code.
        </p>
      </footer>
    </div>
  );
}

export default App;
