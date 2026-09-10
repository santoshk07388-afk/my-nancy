/**
 * Web Audio API based ambient romantic piano score generator + audio file player.
 * Plays a warm, emotionally resonant, gentle piano nocturne that requires no external CDN.
 * Also supports loading custom MP3 / audio URLs.
 */

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private noteIndex: number = 0;
  private volume: number = 0.6;
  private customAudio: HTMLAudioElement | null = null;
  private listeners: Set<(playing: boolean) => void> = new Set();
  private title: string = 'Our Song — Cinematic Piano';

  // Chord progression in F minor / Ab Major:
  // Fm (F3, C4, Ab4), Db (Db3, Ab3, F4), Ab (Ab2, Eb3, C4), Eb (Eb3, Bb3, G4)
  private readonly chords: { root: number; notes: number[] }[] = [
    { root: 174.61, notes: [174.61, 261.63, 349.23, 415.30, 523.25] }, // Fm
    { root: 138.59, notes: [138.59, 207.65, 277.18, 349.23, 415.30] }, // Db
    { root: 207.65, notes: [207.65, 311.13, 415.30, 523.25, 622.25] }, // Ab
    { root: 155.56, notes: [155.56, 233.08, 311.13, 392.00, 466.16] }, // Eb
  ];

  private readonly melody: number[] = [
    523.25, 415.30, 349.23, 415.30, 523.25, 622.25, 523.25,
    415.30, 349.23, 277.18, 349.23, 415.30, 349.23, 261.63,
    415.30, 523.25, 622.25, 698.46, 622.25, 523.25, 415.30,
    392.00, 466.16, 523.25, 466.16, 392.00, 311.13, 349.23,
  ];

  public subscribe(cb: (playing: boolean) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, duration: number, gainVal: number = 0.15, type: OscillatorType = 'sine') {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Warm filter for acoustic feel
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(gainVal, now + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(gainVal * 0.4, now + 0.5);
    noteGain.gain.exponentialRampToValueAtTime(0.00001, now + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  private tick() {
    if (!this.isPlaying || !this.ctx) return;

    const chordIndex = Math.floor(this.noteIndex / 4) % this.chords.length;
    const currentChord = this.chords[chordIndex];

    // Play bass pedal note every 4 beats
    if (this.noteIndex % 4 === 0) {
      this.playTone(currentChord.root, 3.8, 0.25, 'triangle');
      this.playTone(currentChord.root * 0.5, 3.8, 0.15, 'sine');
    }

    // Play chord harmony
    const note = currentChord.notes[this.noteIndex % currentChord.notes.length];
    this.playTone(note, 2.2, 0.12, 'sine');

    // Play delicate melody tone
    const melodyTone = this.melody[this.noteIndex % this.melody.length];
    this.playTone(melodyTone, 1.8, 0.16, 'sine');

    // Occasional high harmonic shimmer
    if (this.noteIndex % 2 === 1) {
      this.playTone(melodyTone * 2, 1.2, 0.04, 'sine');
    }

    this.noteIndex++;
    this.timerId = window.setTimeout(() => this.tick(), 680);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  public play() {
    if (this.customAudio) {
      this.customAudio.play().catch(() => {});
      this.isPlaying = true;
      this.notify();
      return;
    }

    this.initContext();
    this.isPlaying = true;
    this.tick();
    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    if (this.customAudio) {
      this.customAudio.pause();
    }
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.customAudio) {
      this.customAudio.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getTitle(): string {
    return this.title;
  }

  public setCustomAudioUrl(url: string, title?: string) {
    this.pause();
    if (url) {
      this.customAudio = new Audio(url);
      this.customAudio.loop = true;
      this.customAudio.volume = this.volume;
      this.title = title || 'Custom Song';
    } else {
      this.customAudio = null;
      this.title = 'Our Song — Cinematic Piano';
    }
  }
}

export const audioEngine = new RomanticAudioEngine();
