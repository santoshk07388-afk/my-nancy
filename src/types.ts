export interface MemoryPhoto {
  id: string;
  url: string;
  category: string;
  caption: string;
  date?: string;
  location?: string;
  aspect?: 'portrait' | 'landscape' | 'square';
  rotation?: number;
}

export interface TimelineMilestone {
  id: string;
  title: string;
  date: string;
  caption: string;
  photoUrl: string;
  category?: string;
}

export interface AppreciatedQuality {
  id: string;
  title: string;
  quote: string;
  detail: string;
  tag: string;
}

export interface FutureMoment {
  id: string;
  text: string;
  detail: string;
}

export interface RandomMemoryPrompt {
  photoUrl: string;
  caption: string;
  message: string;
  date?: string;
}
