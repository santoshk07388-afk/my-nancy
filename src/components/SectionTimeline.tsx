import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { TimelineMilestone } from '../types';
import { Calendar, Edit3, Check, Clock, Camera, Sparkles, Sliders, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

interface SectionTimelineProps {
  timeline: TimelineMilestone[];
  onUpdateMilestone?: (id: string, newDate: string, newCaption: string, newPhotoUrl?: string, newTitle?: string) => void;
  onOpenCustomizer?: () => void;
}

export const SectionTimeline: React.FC<SectionTimelineProps> = ({
  timeline,
  onUpdateMilestone,
  onOpenCustomizer,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempDate, setTempDate] = useState('');
  const [tempCaption, setTempCaption] = useState('');
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadTargetId, setActiveUploadTargetId] = useState<string | null>(null);

  const startEditing = (m: TimelineMilestone) => {
    setEditingId(m.id);
    setTempTitle(m.title);
    setTempDate(m.date);
    setTempCaption(m.caption);
    setTempPhotoUrl(m.photoUrl);
  };

  const saveEditing = (id: string) => {
    if (onUpdateMilestone) {
      onUpdateMilestone(id, tempDate, tempCaption, tempPhotoUrl, tempTitle);
    }
    setEditingId(null);
  };

  const triggerUploadFor = (id: string) => {
    setActiveUploadTargetId(id);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadTargetId) return;

    try {
      setUploadingId(activeUploadTargetId);
      const compressed = await compressImage(file, 1280, 1280, 0.85);

      const target = timeline.find((t) => t.id === activeUploadTargetId);
      if (target && onUpdateMilestone) {
        onUpdateMilestone(
          target.id,
          target.date,
          target.caption,
          compressed,
          target.title
        );
      }

      if (editingId === activeUploadTargetId) {
        setTempPhotoUrl(compressed);
      }
    } catch (err) {
      console.error('Failed to update timeline photo:', err);
    } finally {
      setUploadingId(null);
      setActiveUploadTargetId(null);
    }
  };

  return (
    <section id="timeline-section" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto">
      {/* Hidden file input for quick direct milestone photo uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Background glow behind timeline */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#5d1326]/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs tracking-wider uppercase mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>Timeline of Us</span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl text-rose-100 font-normal tracking-tight">
          Little Moments That Became Our Story
        </h2>
        <p className="font-serif-cormorant text-xl text-stone-300/80 italic mt-3">
          The dates we didn't plan, and the memories that stayed forever.
        </p>

        {/* Quick customization helper bar */}
        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
          <span className="text-xs text-stone-400 font-sans-clean">
            Tap <strong className="text-pink-300 font-medium">"Change Photo"</strong> on any milestone to use your couple pictures
          </span>
          {onOpenCustomizer && (
            <button
              onClick={onOpenCustomizer}
              className="inline-flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 underline font-sans-clean cursor-pointer"
            >
              <Sliders className="w-3 h-3" />
              <span>Customize All</span>
            </button>
          )}
        </div>
      </div>

      {/* Central glowing vertical thread */}
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-pink-400/40 to-transparent md:-translate-x-1/2" />

        {/* Timeline Items */}
        <div className="space-y-16 sm:space-y-20">
          {timeline.map((item, idx) => {
            const isEven = idx % 2 === 0;
            const isEditing = editingId === item.id;
            const isUploading = uploadingId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.9, delay: idx * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Center Node Pin */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#200812] border-2 border-amber-300/80 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.6)] z-20">
                  <div className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                  <div className="w-2 h-2 rounded-full bg-amber-200 absolute" />
                </div>

                {/* Milestone Card */}
                <div className="ml-12 md:ml-0 md:w-[calc(50%-2.5rem)] w-full">
                  <div className="relative rounded-2xl glass-wine p-5 sm:p-6 border border-pink-500/20 shadow-2xl backdrop-blur-md group hover:border-pink-400/40 transition-all duration-300">
                    
                    {/* Header Row: Date & Action Buttons */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {isEditing ? (
                        <div className="flex items-center gap-2 w-full">
                          <Calendar className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          <input
                            type="text"
                            value={tempDate}
                            onChange={(e) => setTempDate(e.target.value)}
                            placeholder="e.g. October 14"
                            className="bg-black/50 border border-pink-400/40 text-rose-100 text-xs rounded px-2 py-1 w-full font-sans-clean focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#350d1a] border border-pink-400/25 text-amber-200 text-xs font-sans-clean font-medium">
                          <Calendar className="w-3 h-3 text-amber-300" />
                          <span>{item.date}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        {isEditing ? (
                          <button
                            onClick={() => saveEditing(item.id)}
                            className="p-1.5 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs flex items-center gap-1 px-2.5 transition cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditing(item)}
                            className="p-1.5 rounded-full text-stone-400 hover:text-amber-200 hover:bg-white/5 transition cursor-pointer"
                            title="Edit date and caption"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Milestone Image Container in 16:9 Format */}
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-stone-900 mb-4 border border-white/10 group/img shadow-md">
                      <img
                        src={isEditing ? tempPhotoUrl || item.photoUrl : item.photoUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1b0811]/80 via-transparent to-transparent pointer-events-none" />

                      {/* Quick "Change Photo" button directly on the image */}
                      <button
                        onClick={() => triggerUploadFor(item.id)}
                        disabled={isUploading}
                        className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/90 text-pink-200 hover:text-white text-xs font-sans-clean backdrop-blur-md border border-pink-500/40 shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer disabled:opacity-50"
                        title="Upload your photo for this milestone"
                      >
                        <Camera className="w-3.5 h-3.5 text-pink-400" />
                        <span>{isUploading ? 'Updating...' : 'Change Photo'}</span>
                      </button>

                      {item.category && (
                        <span className="absolute top-2.5 left-2.5 text-[10px] uppercase tracking-wider font-sans-clean font-medium bg-black/60 text-amber-200 px-2 py-0.5 rounded-md backdrop-blur-sm border border-amber-400/20">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    {isEditing ? (
                      <div className="mb-2">
                        <label className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Title</label>
                        <input
                          type="text"
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          className="w-full bg-black/50 border border-pink-400/40 text-rose-100 text-base font-serif-cormorant rounded px-2.5 py-1 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    ) : (
                      <h3 className="font-serif-cormorant text-2xl sm:text-3xl text-rose-100 font-medium tracking-tight">
                        {item.title}
                      </h3>
                    )}

                    {/* Caption */}
                    {isEditing ? (
                      <div className="mt-2">
                        <label className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Caption / Story</label>
                        <textarea
                          value={tempCaption}
                          onChange={(e) => setTempCaption(e.target.value)}
                          rows={3}
                          className="w-full bg-black/50 border border-pink-400/40 text-stone-200 text-sm rounded-lg p-2.5 font-sans-clean focus:outline-none focus:border-amber-400"
                          placeholder="Milestone caption..."
                        />
                      </div>
                    ) : (
                      <p className="mt-2 font-serif-cormorant text-lg sm:text-xl text-stone-300/90 italic leading-relaxed">
                        “{item.caption}”
                      </p>
                    )}
                  </div>
                </div>

                {/* Empty spacer for the alternating side on desktop */}
                <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
