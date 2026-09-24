import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { ImageGrid } from '../components/ImageGrid';
import { DigitalInvite } from '../components/DigitalInvite';
import { GuestUploadModal } from '../components/GuestUploadModal';
import { 
  Download, 
  Camera, 
  Loader2, 
  UploadCloud, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Heart,
  Award,
  ArrowRight,
  QrCode
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'motion/react';
import { notify } from '../lib/toast';
import { getWeddingAlbumById, WEDDING_ALBUMS } from '../data/weddingAlbums';

export function EventGallery() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const showInvite = searchParams.get('invite') === 'true';
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [guestPendingUploads, setGuestPendingUploads] = useState<any[]>([]);
  const [showPendingDrawer, setShowPendingDrawer] = useState(true);

  // Sync guest pending submissions from local storage
  const syncGuestSubmissions = () => {
    if (!id) return;
    try {
      const key = `lensdrop_guest_uploads_${id}`;
      const saved = JSON.parse(localStorage.getItem(key) || '[]');
      setGuestPendingUploads(saved);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    syncGuestSubmissions();

    const handleOpenUpload = () => setIsUploadModalOpen(true);
    window.addEventListener('open-guest-upload', handleOpenUpload);
    return () => window.removeEventListener('open-guest-upload', handleOpenUpload);
  }, [id]);

  useEffect(() => {
    if (!id) return;

    // Check if it matches any of the real wedding showcase albums (or demo)
    const showcaseAlbum = getWeddingAlbumById(id);
    if (showcaseAlbum) {
      setEvent({
        id: showcaseAlbum.id,
        title: showcaseAlbum.title,
        couple: showcaseAlbum.couple,
        venue: showcaseAlbum.venue,
        city: showcaseAlbum.city,
        state: showcaseAlbum.state,
        date: showcaseAlbum.date,
        photographer: showcaseAlbum.photographer,
        story: showcaseAlbum.story,
        theme: showcaseAlbum.theme,
        badge: showcaseAlbum.badge,
        guestCount: showcaseAlbum.guestCount,
        createdBy: 'showcase',
        images: showcaseAlbum.images
      });
      setLoading(false);
      return;
    }

    let unsubscribe = () => {};

    // First check localStorage
    const savedEvents = localStorage.getItem('lensdrop_events');
    let localEvent = null;
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        localEvent = parsedEvents.find((e: any) => e.id === id);
        if (localEvent) {
          setEvent(localEvent);
          setLoading(false);
        }
      } catch (e) {
        console.error('Failed to parse local events');
      }
    }

    try {
      const docRef = doc(db, 'events', id);
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
          setLoading(false);
        } else if (!localEvent) {
          setEvent(null);
          setLoading(false);
        }
      }, (error) => {
        console.error("Error fetching event:", error);
        if (!localEvent) {
          setEvent(null);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error("Firebase error:", error);
      if (!localEvent) {
        setEvent(null);
      }
      setLoading(false);
    }

    return () => unsubscribe();
  }, [id]);

  const allPhotos = event?.images || [];
  // Only photos with status 'approved' or legacy photos without status are shown publicly
  const photos = allPhotos.filter((p: any) => p.status === 'approved' || !p.status);

  // Compute pending uploads specifically submitted by this guest on this device
  const myPendingSubmissions = guestPendingUploads.filter((pendingPhoto: any) => {
    // If it was already approved in allPhotos, it's now in the public gallery!
    const matchingPhotoInEvent = allPhotos.find((p: any) => 
      (p.public_id && p.public_id === pendingPhoto.public_id) || 
      (p.url && p.url === pendingPhoto.url)
    );
    return matchingPhotoInEvent ? matchingPhotoInEvent.status === 'pending' : true;
  });

  const handleDownloadAll = async () => {
    if (photos.length === 0) return;
    
    setDownloadingAll(true);
    setDownloadProgress(0);
    
    try {
      const zip = new JSZip();
      let count = 0;
      
      const fetchPromises = photos.map(async (photo: any) => {
        try {
          const response = await fetch(photo.url);
          const blob = await response.blob();
          zip.file(photo.name || 'photo.jpg', blob);
          count++;
          setDownloadProgress(Math.round((count / photos.length) * 100));
        } catch (err) {
          console.error(`Failed to fetch ${photo.name}`, err);
        }
      });
      
      await Promise.all(fetchPromises);
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${event.title.replace(/\s+/g, '_')}_Photos.zip`);
      notify.success("Download started!");
      
    } catch (error) {
      console.error("Error creating zip:", error);
      notify.error("Failed to download all photos. Please try again or download individually.");
    } finally {
      setDownloadingAll(false);
      setDownloadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="flex-1 min-w-0 space-y-4">
            <div className="h-10 w-3/4 md:w-1/2 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
            <div className="h-5 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-12 w-full md:w-48 bg-slate-200 dark:bg-slate-800 rounded-xl sm:rounded-full animate-pulse shrink-0"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Event Not Found</h2>
        <p className="text-gray-500 dark:text-slate-400">This gallery may have been deleted or the link is incorrect.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto"
    >
      {(showInvite || event.invite) && event.invite && (
        <DigitalInvite title={event.title} invite={event.invite} />
      )}

      {/* Moderation Awareness Banner */}
      {event.moderationEnabled && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/30 backdrop-blur-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                Host Moderation Active
              </p>
              <p className="text-xs text-slate-400">
                Guests can upload memories freely! Photos appear in the live gallery once approved by the host.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shrink-0 transition-colors"
          >
            Drop Photos
          </button>
        </div>
      )}

      {/* Guest's Personal Pending Submissions Tray */}
      {myPendingSubmissions.length > 0 && event.moderationEnabled && (
        <div className="mb-8 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 backdrop-blur-md">
          <div 
            onClick={() => setShowPendingDrawer(!showPendingDrawer)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-300">
                Your Pending Submissions ({myPendingSubmissions.length})
              </span>
              <span className="text-[10px] text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                Held for Host Review
              </span>
            </div>
            <button className="text-amber-400 p-1">
              {showPendingDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showPendingDrawer && (
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-2 border-t border-amber-500/20">
              {myPendingSubmissions.map((sub, idx) => (
                <div key={sub.public_id || idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-amber-500/40">
                  <img src={sub.url} alt="Submission" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1 text-center">
                    <span className="text-[9px] font-semibold text-amber-300 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                      In Queue
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wedding Album Header & Client Details */}
      <div className="mb-8">
        {/* Showcase Switcher if browsing real wedding portfolios */}
        {WEDDING_ALBUMS.some(a => a.id === event.id || id === 'demo') && (
          <div className="mb-6 p-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-gray-200/80 dark:border-white/[0.08] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-2 mb-2 px-1">
              <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Featured Real Wedding Albums (25 Photos Each)
              </span>
              <Link 
                to="/wedding-qrs" 
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>All QR Passes</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {WEDDING_ALBUMS.map((alb) => {
                const isActive = alb.id === event.id || (id === 'demo' && alb.id === 'arjun-ananya-udaipur');
                return (
                  <Link
                    key={alb.id}
                    to={`/event/${alb.id}`}
                    className={`p-2 rounded-xl text-left transition-all flex flex-col ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                        : 'bg-gray-100/80 dark:bg-slate-800/60 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold opacity-80">{alb.badge}</span>
                    <span className="text-xs font-bold truncate mt-0.5">{alb.couple}</span>
                    <span className="text-[10px] opacity-75 truncate">{alb.city}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 min-w-0">
            {event.badge && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-2">
                {event.badge} • Real Wedding Collective
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 break-words">
              {event.couple ? event.couple : event.title}
            </h1>
            
            {/* Meta details if available */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-600 dark:text-slate-400 mt-2">
              {event.venue && (
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  {event.venue}, {event.city}
                </span>
              )}
              {event.date && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  {event.date}
                </span>
              )}
              {event.photographer && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Camera className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  Photo: {event.photographer}
                </span>
              )}
              <span className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                {photos.length} High-Res Raw Photos
              </span>
            </div>

            {event.story && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mt-3 max-w-3xl leading-relaxed italic">
                "{event.story}"
              </p>
            )}
          </motion.div>
          
          <div className="flex items-center gap-3 flex-wrap shrink-0">
            {/* Guest Upload Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25 shrink-0 w-full sm:w-auto"
            >
              <UploadCloud className="w-5 h-5" />
              Drop Photos
            </button>

            {photos.length > 0 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleDownloadAll}
                disabled={downloadingAll}
                className="bg-gray-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-md shrink-0 w-full sm:w-auto"
              >
                {downloadingAll ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Zipping... {downloadProgress}%
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download All ZIP ({photos.length})
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {photos.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-white dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm"
        >
          <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-10 h-10 text-gray-400 dark:text-slate-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No photos in gallery yet</h3>
          <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            Be the first guest to drop a photo and share your wedding memories with everyone!
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md transition-colors"
          >
            <UploadCloud className="w-5 h-5" />
            Upload First Photo
          </button>
        </motion.div>
      ) : (
        <ImageGrid photos={photos} />
      )}

      {/* Guest Upload Modal */}
      <GuestUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        eventId={id!}
        eventTitle={event.title}
        moderationEnabled={!!event.moderationEnabled}
        onUploadSuccess={() => {
          syncGuestSubmissions();
        }}
      />
    </motion.div>
  );
}
