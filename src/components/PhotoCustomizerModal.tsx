import React, { useState, useRef } from 'react';
import { MemoryPhoto, TimelineMilestone } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { audioEngine } from '../utils/audioEngine';
import {
  X,
  Upload,
  Camera,
  Music,
  Check,
  RotateCcw,
  Sparkles,
  Loader2,
  Trash2,
  Plus,
  Clock,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';

interface PhotoCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: MemoryPhoto[];
  timeline?: TimelineMilestone[];
  onSavePhotos: (photos: MemoryPhoto[]) => Promise<void> | void;
  onSaveTimeline?: (timeline: TimelineMilestone[]) => Promise<void> | void;
  onResetDefaults: () => void;
}

const DEFAULT_CATEGORIES = [
  'First Memories',
  'Favorite Smiles',
  'Adventures Together',
  'The Quiet Moments',
  'Unforgettable',
  'Forever Us',
];

export const PhotoCustomizerModal: React.FC<PhotoCustomizerModalProps> = ({
  isOpen,
  onClose,
  photos,
  timeline = [],
  onSavePhotos,
  onSaveTimeline,
  onResetDefaults,
}) => {
  const [localPhotos, setLocalPhotos] = useState<MemoryPhoto[]>(photos);
  const [localTimeline, setLocalTimeline] = useState<TimelineMilestone[]>(timeline);
  const [activeTab, setActiveTab] = useState<'photos' | 'timeline' | 'music'>('photos');
  const [customAudioUrl, setCustomAudioUrl] = useState('');
  const [customSongTitle, setCustomSongTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Hidden inputs for file selections
  const batchReplaceRef = useRef<HTMLInputElement>(null);
  const batchAddRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Keep in sync when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalPhotos(photos);
      setLocalTimeline(timeline);
    }
  }, [isOpen, photos, timeline]);

  if (!isOpen) return null;

  // Single gallery photo replacement
  const handleSingleFileUpload = async (index: number, file: File) => {
    try {
      setIsProcessing(true);
      setProcessingStatus('Optimizing photo for phone...');
      const compressedDataUrl = await compressImage(file, 1440, 1440, 0.84);
      const updated = [...localPhotos];
      updated[index] = { ...updated[index], url: compressedDataUrl };
      setLocalPhotos(updated);
    } catch (err) {
      console.error('Failed to process image:', err);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  // Timeline milestone photo replacement
  const handleTimelineMilestoneUpload = async (milestoneId: string, file: File) => {
    try {
      setIsProcessing(true);
      setProcessingStatus('Optimizing milestone photo (16:9 widescreen)...');
      const compressedDataUrl = await compressImage(file, 1920, 1080, 0.86);
      const updated = localTimeline.map((m) =>
        m.id === milestoneId ? { ...m, photoUrl: compressedDataUrl } : m
      );
      setLocalTimeline(updated);
    } catch (err) {
      console.error('Failed to update timeline photo:', err);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  // Batch multiple photos upload (Replace All or Append)
  const handleBatchFileUpload = async (files: FileList | null, replaceAll = false) => {
    if (!files || files.length === 0) return;

    try {
      setIsProcessing(true);
      const fileArray = Array.from(files);
      const newItems: MemoryPhoto[] = [];

      for (let i = 0; i < fileArray.length; i++) {
        setProcessingStatus(`Optimizing photo ${i + 1} of ${fileArray.length}...`);
        const compressed = await compressImage(fileArray[i], 1440, 1440, 0.84);
        const cat = DEFAULT_CATEGORIES[i % DEFAULT_CATEGORIES.length];
        newItems.push({
          id: `couple-photo-${Date.now()}-${i}`,
          url: compressed,
          category: cat,
          caption: `A cherished memory of Nancy & Santosh`,
          date: 'Special Moment',
        });
      }

      let updatedPhotos: MemoryPhoto[] = [];
      if (replaceAll) {
        updatedPhotos = newItems;
        setLocalPhotos(newItems);
      } else {
        updatedPhotos = [...newItems, ...localPhotos];
        setLocalPhotos(updatedPhotos);
      }

      // Also automatically update Timeline milestones if we have new photos!
      if (localTimeline.length > 0 && newItems.length > 0) {
        const updatedTimeline = localTimeline.map((item, idx) => ({
          ...item,
          photoUrl: updatedPhotos[idx % updatedPhotos.length]?.url || item.photoUrl,
        }));
        setLocalTimeline(updatedTimeline);
      }
    } catch (err) {
      console.error('Error processing batch photos:', err);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleUpdatePhotoField = (index: number, field: keyof MemoryPhoto, value: string) => {
    const updated = [...localPhotos];
    updated[index] = { ...updated[index], [field]: value };
    setLocalPhotos(updated);
  };

  const handleUpdateTimelineField = (id: string, field: keyof TimelineMilestone, value: string) => {
    const updated = localTimeline.map((m) =>
      m.id === id ? { ...m, [field]: value } : m
    );
    setLocalTimeline(updated);
  };

  const handleDeletePhoto = (index: number) => {
    const updated = localPhotos.filter((_, i) => i !== index);
    setLocalPhotos(updated);
  };

  const handleSave = async () => {
    setIsProcessing(true);
    setProcessingStatus('Saving to server so Nancy sees them on her phone...');
    try {
      await onSavePhotos(localPhotos);
      if (onSaveTimeline && localTimeline.length > 0) {
        await onSaveTimeline(localTimeline);
      }
      if (customAudioUrl) {
        audioEngine.setCustomAudioUrl(customAudioUrl, customSongTitle || 'Our Song');
      }
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 900);
    } catch (err) {
      console.error('Failed to save photos:', err);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleAudioFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setCustomAudioUrl(result);
        setCustomSongTitle(file.name.replace(/\.[^/.]+$/, ''));
        audioEngine.setCustomAudioUrl(result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 text-stone-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#1c0812] border border-pink-500/25 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#250916]">
          <div>
            <h2 className="font-serif-cormorant text-2xl font-semibold text-rose-100 flex items-center gap-2">
              <span>Change Pictures With Your Photos</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </h2>
            <p className="text-xs text-stone-400 font-sans-clean">
              Upload real photos of you and Nancy. Everything syncs instantly so she sees them on her phone!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/10 px-6 pt-3 bg-[#17050e] gap-4">
          <button
            onClick={() => setActiveTab('photos')}
            className={`pb-3 text-xs sm:text-sm font-sans-clean font-medium flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'photos'
                ? 'border-pink-400 text-pink-200'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Memory Gallery ({localPhotos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-3 text-xs sm:text-sm font-sans-clean font-medium flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-pink-400 text-pink-200'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Timeline of Us ({localTimeline.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`pb-3 text-xs sm:text-sm font-sans-clean font-medium flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'music'
                ? 'border-pink-400 text-pink-200'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Romantic Music</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: Gallery Photos */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              {/* Batch Action Hero Card */}
              <div className="rounded-2xl bg-gradient-to-r from-[#2b0c1b] to-[#3a1024] p-4 sm:p-5 border border-pink-400/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-serif-cormorant text-lg text-rose-100 font-medium flex items-center gap-2">
                    <Upload className="w-4 h-4 text-pink-400" />
                    <span>Quick Batch Upload From Phone or PC</span>
                  </h3>
                  <p className="text-xs text-stone-300 font-sans-clean max-w-md">
                    Select 4 to 12 photos at once. Photos are compressed automatically for lightning-fast loading on Nancy's mobile phone!
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <input
                    type="file"
                    ref={batchReplaceRef}
                    onChange={(e) => handleBatchFileUpload(e.target.files, true)}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={batchAddRef}
                    onChange={(e) => handleBatchFileUpload(e.target.files, false)}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    disabled={isProcessing}
                    onClick={() => batchReplaceRef.current?.click()}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-sans-clean font-medium shadow-md transition cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace All With Mine</span>
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() => batchAddRef.current?.click()}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-rose-100 text-xs font-sans-clean font-medium border border-white/10 transition cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add More</span>
                  </button>
                </div>
              </div>

              {/* Status banner when processing */}
              {isProcessing && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs font-sans-clean">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0 text-amber-300" />
                  <span>{processingStatus}</span>
                </div>
              )}

              {/* Photo list cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-400 font-sans-clean px-1">
                  <span>Showing {localPhotos.length} memory photos</span>
                  <span className="text-pink-300">Note: The last photo displays in full 16:9 widescreen format!</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {localPhotos.map((photo, idx) => {
                    const isLast = idx === localPhotos.length - 1;
                    return (
                      <div
                        key={photo.id || idx}
                        className={`rounded-2xl bg-[#200813] border p-3.5 space-y-3 transition ${
                          isLast ? 'border-amber-400/40 shadow-lg' : 'border-white/10'
                        }`}
                      >
                        <div className="flex gap-3 items-start">
                          {/* Photo Thumbnail */}
                          <div className={`relative ${isLast ? 'w-28 aspect-[16/9]' : 'w-20 aspect-[4/5]'} rounded-lg overflow-hidden bg-black/50 shrink-0 border border-white/10`}>
                            <img
                              src={photo.url}
                              alt={photo.caption}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {isLast && (
                              <span className="absolute top-1 left-1 text-[9px] bg-black/70 text-amber-300 px-1.5 py-0.5 rounded font-sans-clean font-medium">
                                16:9 Finale
                              </span>
                            )}
                          </div>

                          {/* Action & Metadata */}
                          <div className="flex-1 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-sans-clean text-stone-400 text-[11px]">
                                Photo #{idx + 1} {isLast && '• 16:9 Last Picture'}
                              </span>
                              <div className="flex items-center gap-1">
                                <label className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-pink-300 hover:text-pink-200 cursor-pointer transition">
                                  <Camera className="w-3.5 h-3.5" />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleSingleFileUpload(idx, file);
                                    }}
                                  />
                                </label>
                                {localPhotos.length > 1 && (
                                  <button
                                    onClick={() => handleDeletePhoto(idx)}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-900/40 text-stone-400 hover:text-rose-300 transition cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <input
                              type="text"
                              value={photo.caption}
                              onChange={(e) => handleUpdatePhotoField(idx, 'caption', e.target.value)}
                              placeholder="Caption for Nancy..."
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-rose-100 font-serif-cormorant focus:outline-none focus:border-pink-400"
                            />

                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={photo.date || ''}
                                onChange={(e) => handleUpdatePhotoField(idx, 'date', e.target.value)}
                                placeholder="Date (e.g. Oct 2024)"
                                className="w-1/2 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-stone-300 font-sans-clean focus:outline-none focus:border-pink-400"
                              />
                              <input
                                type="text"
                                value={photo.category}
                                onChange={(e) => handleUpdatePhotoField(idx, 'category', e.target.value)}
                                placeholder="Category tag"
                                className="w-1/2 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-stone-300 font-sans-clean focus:outline-none focus:border-pink-400"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Timeline of Us */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-r from-[#2a0b18] to-[#3a0d22] p-4 sm:p-5 border border-pink-400/20">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-amber-300" />
                  <h3 className="font-serif-cormorant text-lg text-rose-100 font-medium">
                    Timeline of Us — Little Moments That Became Our Story
                  </h3>
                </div>
                <p className="text-xs text-stone-300 font-sans-clean">
                  These represent your foundational milestones. All images are rendered in clean 16:9 widescreen format. Change photos and memories below:
                </p>
              </div>

              <div className="space-y-4">
                {localTimeline.map((item, idx) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-[#200813] border border-white/10 p-4 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {/* 16:9 Milestone Image Preview */}
                      <div className="relative w-full sm:w-48 aspect-[16/9] rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/10 group">
                        <img
                          src={item.photoUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs font-sans-clean cursor-pointer shadow-md transition">
                            <Camera className="w-3 h-3" />
                            <span>Change Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleTimelineMilestoneUpload(item.id, f);
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Fields: Title, Date, Caption */}
                      <div className="flex-1 space-y-2.5 w-full">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1">
                            <label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                              Milestone #{idx + 1} Title
                            </label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => handleUpdateTimelineField(item.id, 'title', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-rose-100 font-serif-cormorant focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          <div className="sm:w-40">
                            <label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                              Date / Period
                            </label>
                            <input
                              type="text"
                              value={item.date}
                              onChange={(e) => handleUpdateTimelineField(item.id, 'date', e.target.value)}
                              placeholder="e.g. October 14"
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-amber-200 font-sans-clean focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                            Story / Caption
                          </label>
                          <textarea
                            rows={2}
                            value={item.caption}
                            onChange={(e) => handleUpdateTimelineField(item.id, 'caption', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-stone-200 font-serif-cormorant focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Music */}
          {activeTab === 'music' && (
            <div className="space-y-5 max-w-lg mx-auto py-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-400/20 text-pink-300 flex items-center justify-center mx-auto">
                  <Music className="w-6 h-6" />
                </div>
                <h3 className="font-serif-cormorant text-2xl text-rose-100 font-medium">
                  Add Your Special Romantic Song
                </h3>
                <p className="text-xs text-stone-300 font-sans-clean">
                  Upload an MP3 or audio file that holds a special memory for you and Nancy. It will play softly as she scrolls through the website.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-pink-400/30 p-6 text-center space-y-3 bg-[#240815]/50">
                <input
                  type="file"
                  ref={audioInputRef}
                  accept="audio/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAudioFileUpload(file);
                  }}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => audioInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs font-sans-clean font-medium shadow-md transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose MP3 File from Device</span>
                </button>

                {customSongTitle && (
                  <p className="text-xs text-emerald-300 font-sans-clean">
                    ✓ Selected: <strong>{customSongTitle}</strong>
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-400 font-sans-clean">Song Title to display in player</label>
                <input
                  type="text"
                  placeholder="e.g. Can't Help Falling In Love"
                  value={customSongTitle}
                  onChange={(e) => setCustomSongTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-pink-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#1e0813] flex-wrap gap-2">
          <button
            onClick={() => {
              if (confirm('Reset to original curated photos and default song?')) {
                onResetDefaults();
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-rose-300 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to defaults</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-sans-clean transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={isProcessing}
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-sans-clean font-medium shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved for Nancy!</span>
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save All Changes</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
