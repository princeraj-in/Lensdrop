import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Maximize2, 
  Clock, 
  Sparkles, 
  CheckCheck, 
  Ban, 
  Filter, 
  Search, 
  X, 
  Eye, 
  User, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { notify } from '../lib/toast';

export interface PhotoItem {
  url: string;
  public_id?: string;
  id?: string;
  name?: string;
  size?: number;
  uploadedAt?: string;
  status?: 'pending' | 'approved' | 'rejected';
  uploaderName?: string;
  uploaderType?: 'host' | 'guest';
  guestNote?: string;
  moderatedAt?: string;
}

interface ModerationQueueProps {
  eventId: string;
  photos: PhotoItem[];
  moderationEnabled: boolean;
  onToggleModeration: (enabled: boolean) => Promise<void>;
  onUpdatePhotoStatus: (photoIds: string[], newStatus: 'approved' | 'rejected') => Promise<void>;
  onDeletePhoto: (photo: PhotoItem) => Promise<void>;
}

export function ModerationQueue({
  photos,
  moderationEnabled,
  onToggleModeration,
  onUpdatePhotoStatus,
  onDeletePhoto
}: ModerationQueueProps) {
  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectPhoto, setInspectPhoto] = useState<PhotoItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [togglingMode, setTogglingMode] = useState(false);

  // Helper to get consistent photo ID
  const getPhotoId = (p: PhotoItem) => p.public_id || p.id || p.url;

  // Normalized photo list with backward compatibility
  const normalizedPhotos = useMemo(() => {
    return photos.map(p => ({
      ...p,
      status: p.status || 'approved'
    }));
  }, [photos]);

  const pendingPhotos = useMemo(() => normalizedPhotos.filter(p => p.status === 'pending'), [normalizedPhotos]);
  const approvedPhotos = useMemo(() => normalizedPhotos.filter(p => p.status === 'approved'), [normalizedPhotos]);
  const rejectedPhotos = useMemo(() => normalizedPhotos.filter(p => p.status === 'rejected'), [normalizedPhotos]);

  // Filtered by active tab and search query
  const displayedPhotos = useMemo(() => {
    let list: PhotoItem[] = [];
    if (activeFilter === 'pending') list = pendingPhotos;
    else if (activeFilter === 'approved') list = approvedPhotos;
    else if (activeFilter === 'rejected') list = rejectedPhotos;
    else list = normalizedPhotos;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(p => 
      (p.name?.toLowerCase() || '').includes(q) ||
      (p.uploaderName?.toLowerCase() || '').includes(q) ||
      (p.guestNote?.toLowerCase() || '').includes(q)
    );
  }, [activeFilter, pendingPhotos, approvedPhotos, rejectedPhotos, normalizedPhotos, searchQuery]);

  const handleToggleMode = async () => {
    setTogglingMode(true);
    try {
      await onToggleModeration(!moderationEnabled);
      notify.success(
        !moderationEnabled 
          ? 'Host Moderation Enabled: New guest uploads will require approval.' 
          : 'Host Moderation Disabled: New guest uploads will publish automatically.'
      );
    } catch (err) {
      console.error(err);
      notify.error('Failed to change moderation setting');
    } finally {
      setTogglingMode(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedPhotoIds.size === displayedPhotos.length) {
      setSelectedPhotoIds(new Set());
    } else {
      setSelectedPhotoIds(new Set(displayedPhotos.map(getPhotoId)));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    const next = new Set(selectedPhotoIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedPhotoIds(next);
  };

  const handleBatchAction = async (status: 'approved' | 'rejected', targetIds?: string[]) => {
    const ids = targetIds || Array.from(selectedPhotoIds);
    if (ids.length === 0) return;

    setIsProcessing(true);
    try {
      await onUpdatePhotoStatus(ids, status);
      setSelectedPhotoIds(new Set());
      notify.success(
        status === 'approved' 
          ? `Approved ${ids.length} photo${ids.length > 1 ? 's' : ''} for public gallery!`
          : `Rejected ${ids.length} photo${ids.length > 1 ? 's' : ''}`
      );
      if (inspectPhoto && ids.includes(getPhotoId(inspectPhoto))) {
        setInspectPhoto(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      console.error(error);
      notify.error('Failed to update photos');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveAllPending = async () => {
    const ids = pendingPhotos.map(getPhotoId);
    if (ids.length === 0) return;
    await handleBatchAction('approved', ids);
  };

  const handleRejectAllPending = async () => {
    const ids = pendingPhotos.map(getPhotoId);
    if (ids.length === 0) return;
    await handleBatchAction('rejected', ids);
  };

  return (
    <div className="space-y-6">
      {/* Moderation Mode Master Toggle Banner */}
      <div className={`p-6 rounded-2xl border transition-all duration-300 ${
        moderationEnabled 
          ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-900/40 border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.1)]' 
          : 'bg-slate-900/40 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-xl shrink-0 ${
              moderationEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
            }`}>
              {moderationEnabled ? (
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              ) : (
                <ShieldAlert className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-semibold text-white text-base">Host Moderation Queue</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  moderationEnabled 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {moderationEnabled ? 'Approval Required' : 'Auto-Publish'}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                {moderationEnabled 
                  ? 'Active protection: New guest uploads wait in this private queue until you approve them for the live gallery.' 
                  : 'Guests can upload directly to the public live gallery without host review.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <span className="text-xs font-medium text-slate-400">
              {moderationEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={moderationEnabled}
              disabled={togglingMode}
              onClick={handleToggleMode}
              className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                moderationEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              } ${togglingMode ? 'opacity-50 cursor-wait' : ''}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  moderationEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => setActiveFilter('pending')}
          className={`p-4 rounded-xl text-left border transition-all ${
            activeFilter === 'pending'
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 ring-1 ring-amber-500/20'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold">Pending Review</span>
            <Clock className={`w-4 h-4 ${pendingPhotos.length > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
          </div>
          <div className="text-2xl font-bold text-white mt-1.5 flex items-baseline gap-2">
            <span>{pendingPhotos.length}</span>
            {pendingPhotos.length > 0 && (
              <span className="text-xs text-amber-400 font-medium">Needs Action</span>
            )}
          </div>
        </button>

        <button
          onClick={() => setActiveFilter('approved')}
          className={`p-4 rounded-xl text-left border transition-all ${
            activeFilter === 'approved'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 ring-1 ring-emerald-500/20'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold">Live in Gallery</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1.5">{approvedPhotos.length}</div>
        </button>

        <button
          onClick={() => setActiveFilter('rejected')}
          className={`p-4 rounded-xl text-left border transition-all ${
            activeFilter === 'rejected'
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 ring-1 ring-rose-500/20'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1.5">{rejectedPhotos.length}</div>
        </button>

        <button
          onClick={() => setActiveFilter('all')}
          className={`p-4 rounded-xl text-left border transition-all ${
            activeFilter === 'all'
              ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300 ring-1 ring-indigo-500/20'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Submissions</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1.5">{normalizedPhotos.length}</div>
        </button>
      </div>

      {/* Search & Batch Action Bar */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Select all checkbox */}
          {displayedPhotos.length > 0 && (
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700 select-none">
              <input
                type="checkbox"
                checked={selectedPhotoIds.size > 0 && selectedPhotoIds.size === displayedPhotos.length}
                onChange={handleSelectAll}
                className="rounded border-slate-600 text-emerald-500 focus:ring-emerald-500/50 bg-slate-700"
              />
              <span>Select All ({displayedPhotos.length})</span>
            </label>
          )}

          {/* Batch action buttons for selected items */}
          {selectedPhotoIds.size > 0 && (
            <div className="flex items-center gap-2">
              <button
                disabled={isProcessing}
                onClick={() => handleBatchAction('approved')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve ({selectedPhotoIds.size})
              </button>
              <button
                disabled={isProcessing}
                onClick={() => handleBatchAction('rejected')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/80 hover:bg-rose-500 text-white shadow-sm transition-colors disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject ({selectedPhotoIds.size})
              </button>
            </div>
          )}

          {/* Fast single-click actions for Pending tab */}
          {activeFilter === 'pending' && pendingPhotos.length > 0 && selectedPhotoIds.size === 0 && (
            <div className="flex items-center gap-2">
              <button
                disabled={isProcessing}
                onClick={handleApproveAllPending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-sm transition-all"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Approve All Pending ({pendingPhotos.length})
              </button>
              <button
                disabled={isProcessing}
                onClick={handleRejectAllPending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                Reject All
              </button>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by guest, photo name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Photos Grid in Moderation Queue */}
      {displayedPhotos.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/30 rounded-2xl border border-slate-800/80">
          <div className="w-16 h-16 rounded-full bg-slate-800/60 text-slate-500 flex items-center justify-center mx-auto mb-3">
            {activeFilter === 'pending' ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400/80" />
            ) : (
              <Filter className="w-8 h-8 text-slate-500" />
            )}
          </div>
          <h4 className="text-base font-semibold text-white">
            {activeFilter === 'pending' 
              ? 'All caught up! No photos pending moderation.' 
              : `No ${activeFilter} photos found.`}
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {activeFilter === 'pending' 
              ? 'When guests upload new photos with moderation enabled, they will appear here for your review.' 
              : 'Try changing the filter or search keywords.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {displayedPhotos.map((photo) => {
              const photoId = getPhotoId(photo);
              const isSelected = selectedPhotoIds.has(photoId);

              return (
                <motion.div
                  key={photoId}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`group relative rounded-2xl overflow-hidden bg-slate-900/80 border transition-all duration-200 flex flex-col ${
                    isSelected 
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg' 
                      : photo.status === 'pending'
                        ? 'border-amber-500/40 hover:border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                        : photo.status === 'rejected'
                          ? 'border-rose-500/30 hover:border-rose-500/60 opacity-80 hover:opacity-100'
                          : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Image Container with aspect ratio */}
                  <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.name || 'Submitted photo'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Select Checkbox (top left) */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelectOne(photoId);
                        }}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'bg-black/40 border-white/40 text-transparent hover:border-white'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Status Pill (top right) */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      {photo.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/90 text-slate-950 backdrop-blur-md flex items-center gap-1 shadow-sm">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {photo.status === 'approved' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
                          <CheckCircle2 className="w-3 h-3" /> Live
                        </span>
                      )}
                      {photo.status === 'rejected' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </div>

                    {/* Quick Fullscreen Inspector Button */}
                    <button
                      onClick={() => setInspectPhoto(photo)}
                      className="absolute bottom-2.5 right-2.5 z-10 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white/80 hover:text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Inspect high-res"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Metadata Content */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-medium text-slate-200 truncate">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {photo.uploaderName || (photo.uploaderType === 'host' ? 'Host Upload' : 'Guest')}
                        </span>
                        {photo.uploadedAt && (
                          <span className="text-[10px] text-slate-500 shrink-0">
                            {new Date(photo.uploadedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>

                      {photo.guestNote && (
                        <p className="text-[11px] text-indigo-300/90 bg-indigo-950/40 border border-indigo-500/20 px-2 py-1 rounded-lg italic line-clamp-2 flex items-start gap-1">
                          <MessageSquare className="w-3 h-3 shrink-0 mt-0.5 text-indigo-400" />
                          <span>"{photo.guestNote}"</span>
                        </p>
                      )}
                    </div>

                    {/* Action Buttons Row */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                      {photo.status === 'pending' ? (
                        <>
                          <button
                            disabled={isProcessing}
                            onClick={() => handleBatchAction('approved', [photoId])}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            disabled={isProcessing}
                            onClick={() => handleBatchAction('rejected', [photoId])}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700/80 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </>
                      ) : photo.status === 'rejected' ? (
                        <>
                          <button
                            disabled={isProcessing}
                            onClick={() => handleBatchAction('approved', [photoId])}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Restore & Approve
                          </button>
                          <button
                            disabled={isProcessing}
                            onClick={() => onDeletePhoto(photo)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            disabled={isProcessing}
                            onClick={() => handleBatchAction('rejected', [photoId])}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700/80 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            Hide Photo
                          </button>
                          <button
                            disabled={isProcessing}
                            onClick={() => onDeletePhoto(photo)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Fullscreen Inspector Modal */}
      <AnimatePresence>
        {inspectPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  inspectPhoto.status === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : inspectPhoto.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  Status: {inspectPhoto.status?.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  {inspectPhoto.uploaderName || 'Guest'} • {inspectPhoto.name || 'Photo'}
                </span>
              </div>

              <button
                onClick={() => setInspectPhoto(null)}
                className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Central Photo View */}
            <div className="flex-1 flex items-center justify-center p-2 sm:p-4 my-2 overflow-hidden">
              <img
                src={inspectPhoto.url}
                alt={inspectPhoto.name || 'Inspection'}
                className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Bottom Actions Floating Island */}
            <div className="max-w-xl w-full mx-auto bg-slate-900/90 border border-slate-700/80 p-3 sm:p-4 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
              <div className="text-left w-full sm:w-auto">
                <p className="text-xs font-medium text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  {inspectPhoto.uploaderName || 'Anonymous Guest'}
                </p>
                {inspectPhoto.guestNote ? (
                  <p className="text-[11px] text-slate-300 italic mt-0.5">"{inspectPhoto.guestNote}"</p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-0.5">No note provided</p>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {inspectPhoto.status !== 'approved' && (
                  <button
                    disabled={isProcessing}
                    onClick={async () => {
                      await handleBatchAction('approved', [getPhotoId(inspectPhoto)]);
                      setInspectPhoto(null);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve & Publish
                  </button>
                )}
                {inspectPhoto.status !== 'rejected' && (
                  <button
                    disabled={isProcessing}
                    onClick={async () => {
                      await handleBatchAction('rejected', [getPhotoId(inspectPhoto)]);
                      setInspectPhoto(null);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Photo
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
