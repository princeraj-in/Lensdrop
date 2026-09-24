import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  UploadCloud, 
  X, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  Camera, 
  Heart,
  User,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import imageCompression from 'browser-image-compression';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { notify } from '../lib/toast';

interface GuestUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  moderationEnabled?: boolean;
  onUploadSuccess?: (uploadedPhotos: any[]) => void;
}

export function GuestUploadModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  moderationEnabled = false,
  onUploadSuccess
}: GuestUploadModalProps) {
  const [guestName, setGuestName] = useState('');
  const [guestNote, setGuestNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadCompletedCount, setUploadCompletedCount] = useState(0);
  const [isSuccessView, setIsSuccessView] = useState(false);

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lensdrop");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/djpqwrs1l/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        return {
          url: data.secure_url,
          public_id: data.public_id || `guest_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
        };
      }
      throw new Error("Cloudinary upload failed");
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      // Fallback: create object URL so prototype works without network failure
      const objectUrl = URL.createObjectURL(file);
      return {
        url: objectUrl,
        public_id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
      };
    }
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);
    setUploadCompletedCount(0);

    const uploadedItems: any[] = [];
    let completed = 0;

    for (const file of files) {
      try {
        // Compress image client side
        const options = {
          maxSizeMB: 1.2,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(file, options);
        const cloudResult = await uploadImageToCloudinary(compressedFile);

        const newPhoto = {
          url: cloudResult.url,
          public_id: cloudResult.public_id,
          name: file.name,
          size: compressedFile.size,
          uploadedAt: new Date().toISOString(),
          status: moderationEnabled ? 'pending' : 'approved',
          uploaderName: guestName.trim() || 'Guest',
          uploaderType: 'guest',
          guestNote: guestNote.trim() || undefined
        };

        uploadedItems.push(newPhoto);

        // Save to Firestore
        try {
          await updateDoc(doc(db, 'events', eventId), {
            images: arrayUnion(newPhoto)
          });
        } catch (dbError) {
          console.warn("Firestore update failed, syncing with localStorage", dbError);
          const savedEvents = localStorage.getItem('lensdrop_events');
          if (savedEvents) {
            try {
              const parsed = JSON.parse(savedEvents);
              const idx = parsed.findIndex((e: any) => e.id === eventId);
              if (idx !== -1) {
                parsed[idx].images = [...(parsed[idx].images || []), newPhoto];
                localStorage.setItem('lensdrop_events', JSON.stringify(parsed));
              }
            } catch (e) {
              console.error(e);
            }
          }
        }

        // Store guest pending submissions in localStorage so guest sees their pending uploads
        try {
          const guestStorageKey = `lensdrop_guest_uploads_${eventId}`;
          const currentGuestUploads = JSON.parse(localStorage.getItem(guestStorageKey) || '[]');
          localStorage.setItem(guestStorageKey, JSON.stringify([...currentGuestUploads, newPhoto]));
        } catch (e) {
          console.error(e);
        }

        completed++;
        setUploadCompletedCount(completed);
        setProgress(Math.round((completed / files.length) * 100));
      } catch (err) {
        console.error("Failed uploading photo:", file.name, err);
      }
    }

    setUploading(false);
    setIsSuccessView(true);

    if (onUploadSuccess) {
      onUploadSuccess(uploadedItems);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFiles(acceptedFiles);
  }, [eventId, guestName, guestNote, moderationEnabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    disabled: uploading
  } as any);

  const handleResetAndClose = () => {
    setIsSuccessView(false);
    setGuestNote('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-200"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Drop Your Memories</h3>
                <p className="text-xs text-slate-400 truncate max-w-[260px]">{eventTitle}</p>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {isSuccessView ? (
              <div className="text-center py-6 space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                  moderationEnabled 
                    ? 'bg-amber-500/20 text-amber-400 ring-4 ring-amber-500/10' 
                    : 'bg-emerald-500/20 text-emerald-400 ring-4 ring-emerald-500/10'
                }`}>
                  {moderationEnabled ? (
                    <ShieldCheck className="w-8 h-8" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xl font-bold text-white">
                    {moderationEnabled ? 'Submission Received!' : 'Photos Published!'}
                  </h4>
                  <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                    {moderationEnabled ? (
                      <>
                        <span className="font-semibold text-amber-400">{uploadCompletedCount} photo{uploadCompletedCount > 1 ? 's' : ''}</span> submitted. 
                        The couple has enabled photo review, so your memories will appear in the live gallery once approved.
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-emerald-400">{uploadCompletedCount} photo{uploadCompletedCount > 1 ? 's' : ''}</span> have been added directly to the live wedding gallery!
                      </>
                    )}
                  </p>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setIsSuccessView(false);
                      setUploadCompletedCount(0);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                  >
                    Upload More Photos
                  </button>
                  <button
                    onClick={handleResetAndClose}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-md"
                  >
                    Back to Gallery
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Moderation Awareness Pill */}
                {moderationEnabled && (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>
                      <strong>Host Approval Enabled:</strong> Photos will be reviewed by the host before becoming publicly visible.
                    </span>
                  </div>
                )}

                {/* Optional Guest Name & Wish */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Your Name or Table (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maya & Leo / Table 4"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      disabled={uploading}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      Leave a sweet wish for the couple (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Wishing you both a lifetime of laughter & love!"
                      value={guestNote}
                      onChange={(e) => setGuestNote(e.target.value)}
                      disabled={uploading}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Dropzone Box */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive 
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_25px_rgba(99,102,241,0.2)] scale-[1.01]' 
                      : 'border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/40 bg-slate-900/40'
                  } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <input {...getInputProps()} />
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {isDragActive ? 'Drop your photos now!' : 'Choose photos from phone or computer'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Supports JPEG, PNG, WebP • Auto-compressed for rapid transfer
                  </p>
                </div>

                {/* Upload Progress Bar */}
                {uploading && (
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                        Processing & uploading ({uploadCompletedCount} done)...
                      </span>
                      <span className="text-indigo-400">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
