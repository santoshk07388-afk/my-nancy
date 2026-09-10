import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Settings2 } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface AudioPlayerProps {
  onOpenCustomizer?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ onOpenCustomizer }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [trackTitle, setTrackTitle] = useState(audioEngine.getTitle());

  useEffect(() => {
    const unsub = audioEngine.subscribe((playing) => {
      setIsPlaying(playing);
      setTrackTitle(audioEngine.getTitle());
    });
    return unsub;
  }, []);

  const handleToggle = () => {
    audioEngine.toggle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioEngine.setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(volume || 0.6);
    } else {
      setIsMuted(true);
      audioEngine.setVolume(0);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="relative">
        {/* Expanded Controls Panel */}
        {isExpanded && (
          <div className="absolute bottom-14 right-0 w-72 rounded-2xl glass-wine p-4 shadow-2xl border border-pink-500/20 backdrop-blur-xl animate-fade-in text-stone-200 text-sm">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-pink-400" />
                <span className="font-serif-cormorant text-base font-semibold text-pink-200">Our Soundtrack</span>
              </div>
              {onOpenCustomizer && (
                <button
                  onClick={onOpenCustomizer}
                  title="Personalize photos & songs"
                  className="text-stone-400 hover:text-amber-200 transition p-1"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-xs text-stone-300 font-medium truncate mb-2">
              {trackTitle}
            </p>

            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={handleMuteToggle}
                className="text-stone-300 hover:text-pink-300 transition"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-stone-700/60 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
              <span className="text-[11px] text-stone-400 font-mono w-7 text-right">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>

            <div className="mt-3 pt-2 text-[11px] text-stone-400/80 border-t border-white/5 flex items-center justify-between">
              <span>{isPlaying ? 'Playing gently' : 'Music paused'}</span>
              <button
                onClick={handleToggle}
                className="text-pink-300 hover:text-pink-200 font-medium underline underline-offset-2"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>
        )}

        {/* Main Floating Trigger Pill */}
        <div className="flex items-center gap-1.5 bg-[#250912]/90 hover:bg-[#340d1a] border border-pink-500/25 rounded-full pl-3 pr-2 py-1.5 shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300">
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 group text-left cursor-pointer"
            title={isPlaying ? 'Pause music' : 'Play our song'}
          >
            <div className="w-7 h-7 rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300 group-hover:scale-105 transition-transform">
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-pink-300" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-pink-300 ml-0.5" />
              )}
            </div>
            <div className="hidden sm:flex flex-col pr-1">
              <span className="text-[10px] uppercase tracking-wider text-pink-300/80 font-semibold">
                {isPlaying ? 'Now Playing' : '♫ Play Our Song'}
              </span>
              <span className="text-xs text-stone-200 font-serif-cormorant font-medium max-w-[110px] truncate">
                {trackTitle}
              </span>
            </div>
          </button>

          {/* Equalizer bars animation when playing */}
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-3.5 px-1">
              <div className="w-0.5 bg-pink-400/80 h-full animate-[pulse_0.7s_ease-in-out_infinite]" />
              <div className="w-0.5 bg-pink-300 h-2/3 animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
              <div className="w-0.5 bg-pink-400/80 h-4/5 animate-[pulse_0.8s_ease-in-out_infinite_0.4s]" />
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-7 h-7 flex items-center justify-center rounded-full text-stone-400 hover:text-pink-200 hover:bg-white/5 transition"
            title="Sound options"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-stone-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-pink-300/90" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
