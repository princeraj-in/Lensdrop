import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { QRGenerator } from '../components/QRGenerator';
import { UploadZone } from '../components/UploadZone';
import { InvitationGenerator } from '../components/InvitationGenerator';
import { ModerationQueue } from '../components/ModerationQueue';
import { 
  ArrowLeft, 
  Trash2, 
  ExternalLink, 
  Image as ImageIcon, 
  MailOpen, 
  CircleCheck, 
  X, 
  ShieldCheck, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { motion } from 'motion/react';
import { notify } from '../lib/toast';
import { Loader } from '../components/Loader';
import { ConfirmModal } from '../components/ConfirmModal';

export function EventAdmin() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'gallery' | 'moderation' | 'invite'>('gallery');
  const [photoToDelete, setPhotoToDelete] = useState<any>(null);

  useEffect(() => {
    if (!user || !id) return;

    let unsubscribe = () => {};

    // First check localStorage
    const savedEvents = localStorage.getItem('lensdrop_events');
    let localEvent = null;
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        localEvent = parsedEvents.find((e: any) => e.id === id);
        if (localEvent) {
          if (localEvent.createdBy !== user.uid) {
            navigate('/dashboard');
            return;
          }
          setEvent(localEvent);
          setLoading(false);
        }
      } catch (e) {
        console.error('Failed to parse local events');
      }
    }

    // Then try Firebase
    try {
      const docRef = doc(db, 'events', id);
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.createdBy !== user.uid) {
            navigate('/dashboard');
            return;
          }
          setEvent({ id: docSnap.id, ...data });
          setLoading(false);
        } else if (!localEvent) {
          navigate('/dashboard');
        }
      }, (error) => {
        console.error("Error fetching event from Firebase:", error);
        if (!localEvent) {
          navigate('/dashboard');
        }
        setLoading(false);
      });
    } catch (error) {
      console.error("Firebase initialization error:", error);
      if (!localEvent) {
        navigate('/dashboard');
      }
      setLoading(false);
    }

    return () => unsubscribe();
  }, [id, user, navigate]);

  const handleDeletePhoto = async () => {
    if (!photoToDelete) return;
    
    try {
      await updateDoc(doc(db, 'events', id!), {
        images: arrayRemove(photoToDelete)
      });
      notify.success('Photo removed');
    } catch (error) {
      console.error("Error deleting photo from Firebase:", error);
      
      // Fallback to localStorage
      const savedEvents = localStorage.getItem('lensdrop_events');
      if (savedEvents) {
        try {
          const parsedEvents = JSON.parse(savedEvents);
          const eventIndex = parsedEvents.findIndex((e: any) => e.id === id);
          if (eventIndex !== -1) {
            parsedEvents[eventIndex].images = parsedEvents[eventIndex].images.filter((img: any) => (img.public_id || img.url) !== (photoToDelete.public_id || photoToDelete.url));
            localStorage.setItem('lensdrop_events', JSON.stringify(parsedEvents));
            setEvent(parsedEvents[eventIndex]); // Update local state
            notify.success('Photo removed locally');
          } else {
            notify.error('Failed to remove photo');
          }
        } catch (e) {
          console.error('Failed to update local storage', e);
          notify.error('Failed to remove photo');
        }
      } else {
        notify.error('Failed to remove photo');
      }
    } finally {
      setPhotoToDelete(null);
    }
  };

  const handleToggleModeration = async (enabled: boolean) => {
    try {
      await updateDoc(doc(db, 'events', id!), {
        moderationEnabled: enabled
      });
    } catch (err) {
      console.warn("Firebase update failed, updating localStorage", err);
    }

    setEvent((prev: any) => ({ ...prev, moderationEnabled: enabled }));

    const savedEvents = localStorage.getItem('lensdrop_events');
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
        const idx = parsed.findIndex((e: any) => e.id === id);
        if (idx !== -1) {
          parsed[idx].moderationEnabled = enabled;
          localStorage.setItem('lensdrop_events', JSON.stringify(parsed));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleUpdatePhotoStatus = async (photoIds: string[], newStatus: 'approved' | 'rejected') => {
    const currentImages = event.images || [];
    const updatedImages = currentImages.map((img: any) => {
      const imgId = img.public_id || img.id || img.url;
      if (photoIds.includes(imgId)) {
        return {
          ...img,
          status: newStatus,
          moderatedAt: new Date().toISOString()
        };
      }
      return img;
    });

    try {
      await updateDoc(doc(db, 'events', id!), {
        images: updatedImages
      });
    } catch (err) {
      console.warn("Firebase update error:", err);
    }

    setEvent((prev: any) => ({ ...prev, images: updatedImages }));

    const savedEvents = localStorage.getItem('lensdrop_events');
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
        const idx = parsed.findIndex((e: any) => e.id === id);
        if (idx !== -1) {
          parsed[idx].images = updatedImages;
          localStorage.setItem('lensdrop_events', JSON.stringify(parsed));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading || !event) {
    return <Loader />;
  }

  const galleryUrl = `${window.location.origin}/event/${id}`;
  const photos = event.images || [];
  const pendingCount = photos.filter((p: any) => p.status === 'pending').length;
  const approvedPhotos = photos.filter((p: any) => p.status === 'approved' || !p.status);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white break-words flex-1 min-w-0">{event.title}</h1>
            <a 
              href={galleryUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-4 py-2 rounded-lg transition-colors shrink-0"
            >
              View Gallery <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-4 mb-8 border-b border-gray-200 dark:border-slate-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === 'gallery'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Live Gallery ({approvedPhotos.length})
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === 'moderation'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Moderation Queue
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('invite')}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === 'invite'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              <MailOpen className="w-4 h-4" /> Digital Invitation
            </button>
          </div>

          {activeTab === 'gallery' ? (
            <>
              {event.moderationEnabled && pendingCount > 0 && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {pendingCount} photo{pendingCount > 1 ? 's' : ''} awaiting moderation
                      </p>
                      <p className="text-xs text-slate-400">
                        Guest submissions are held privately until approved.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('moderation')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shrink-0"
                  >
                    Review Queue
                  </button>
                </div>
              )}

              <UploadZone 
                eventId={id!} 
                onUploadComplete={(newImage) => {
                  setEvent((prev: any) => ({
                    ...prev,
                    images: [...(prev?.images || []), newImage]
                  }));
                }}
              />

              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Public Gallery Photos ({approvedPhotos.length})
                  </h2>
                  {event.moderationEnabled && (
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Moderation Active
                    </span>
                  )}
                </div>
                
                {approvedPhotos.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-slate-800 border-dashed">
                    <p className="text-gray-500 dark:text-slate-400">No approved photos in the public gallery yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {approvedPhotos.map((photo: any, index: number) => (
                      <motion.div 
                        key={photo.public_id || photo.id || index} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800"
                      >
                        <img 
                          src={photo.url} 
                          alt={photo.name || 'Event photo'} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setPhotoToDelete(photo)}
                            className="bg-black/50 text-white p-1.5 rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-sm"
                            title="Delete photo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : activeTab === 'moderation' ? (
            <ModerationQueue
              eventId={id!}
              photos={photos}
              moderationEnabled={!!event.moderationEnabled}
              onToggleModeration={handleToggleModeration}
              onUpdatePhotoStatus={handleUpdatePhotoStatus}
              onDeletePhoto={async (photo) => {
                setPhotoToDelete(photo);
              }}
            />
          ) : (
            <InvitationGenerator eventId={id!} eventTitle={event.title} initialData={event.invite} />
          )}

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-800 flex justify-end">
            <button
              onClick={() => {
                notify.success('Event details saved successfully!');
                navigate('/dashboard');
              }}
              className="bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center gap-2 shadow-sm"
            >
              <CircleCheck className="w-5 h-5" />
              Save & Finish
            </button>
          </div>
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24">
            <QRGenerator url={galleryUrl} title={event.title} />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!photoToDelete}
        title="Remove Photo"
        message="Are you sure you want to remove this photo from the gallery? This action cannot be undone."
        confirmText="Remove"
        onConfirm={handleDeletePhoto}
        onCancel={() => setPhotoToDelete(null)}
      />
    </motion.div>
  );
}
