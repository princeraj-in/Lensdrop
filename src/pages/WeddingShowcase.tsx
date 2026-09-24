import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Camera, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Award, 
  Users, 
  ShieldCheck, 
  Image as ImageIcon,
  ArrowRight,
  Printer
} from 'lucide-react';
import { motion } from 'motion/react';
import { WEDDING_ALBUMS, WeddingAlbum } from '../data/weddingAlbums';
import { notify } from '../lib/toast';

export function WeddingShowcase() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getAlbumUrl = (albumId: string) => {
    return `${window.location.origin}/event/${albumId}`;
  };

  const handleCopyLink = (albumId: string) => {
    const url = getAlbumUrl(albumId);
    navigator.clipboard.writeText(url);
    setCopiedId(albumId);
    notify.success('QR Code Link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadPrintablePass = (album: WeddingAlbum) => {
    const svg = document.getElementById(`qr-svg-${album.id}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // High-resolution print card (1200 x 1600 px at 300 DPI)
    canvas.width = 1200;
    canvas.height = 1600;

    img.onload = () => {
      if (!ctx) return;

      // Dark obsidian luxury background
      const gradient = ctx.createLinearGradient(0, 0, 0, 1600);
      gradient.addColorStop(0, '#0a0d14');
      gradient.addColorStop(0.5, '#0f172a');
      gradient.addColorStop(1, '#05070a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 1600);

      // Gold/Indigo glowing border frame
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.lineWidth = 6;
      ctx.strokeRect(50, 50, 1100, 1500);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.strokeRect(70, 70, 1060, 1460);

      // Top Studio Brand
      ctx.textAlign = 'center';
      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('LENSDROP STUDIO • WEDDING COLLECTIVE', 600, 160);

      // Event Badge
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`[ ${album.badge.toUpperCase()} ]`, 600, 220);

      // Couple Names Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 56px sans-serif';
      ctx.fillText(album.couple, 600, 310);

      // Venue & Date
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'regular 30px sans-serif';
      ctx.fillText(`${album.venue} • ${album.city}`, 600, 370);
      ctx.fillText(album.date, 600, 420);

      // White QR Plate
      const qrBoxSize = 560;
      const qrBoxX = (1200 - qrBoxSize) / 2;
      const qrBoxY = 480;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 40);
      ctx.fill();

      // Draw QR Code onto plate
      ctx.drawImage(img, qrBoxX + 40, qrBoxY + 40, qrBoxSize - 80, qrBoxSize - 80);

      // Scan Instructions
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('POINT CAMERA TO VIEW FULL ALBUM', 600, 1120);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'regular 26px sans-serif';
      ctx.fillText('No apps or logins required • 25 Raw High-Resolution Photos', 600, 1180);
      ctx.fillText('Lossless ZIP download & guest photo drop available', 600, 1220);

      // Photography Credit
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 24px sans-serif';
      ctx.fillText(`Photographed by ${album.photographer}`, 600, 1360);

      // Footer
      ctx.fillStyle = '#475569';
      ctx.font = 'regular 20px sans-serif';
      ctx.fillText('Powered by LensDrop Pro • Table Pass Edition', 600, 1460);

      // Download PNG
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${album.id}_Printable_QR_Pass.png`;
      a.click();
      notify.success(`Printable QR Pass downloaded for ${album.couple}!`);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="text-left space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Verified Real Wedding Collections • 25 Photos Per QR Code</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Real Wedding Albums & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            High-Resolution Scannable QR Codes
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Scan any QR code below using your smartphone camera to immediately experience real 25-photo wedding galleries. Every album features completely unique couples, distinct venues, authentic photo stories, and zero duplicate imagery.
        </p>

        {/* Global Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-gray-200/80 dark:border-white/[0.08]">
            <p className="text-xl font-bold text-gray-900 dark:text-white">4 Collections</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Palace, Beach, Fort & Alpine</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-gray-200/80 dark:border-white/[0.08]">
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">100 Raw Photos</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">25 Unique Shots Per Album</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-gray-200/80 dark:border-white/[0.08]">
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">0 Duplicates</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">100% Unique Client Data</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-gray-200/80 dark:border-white/[0.08]">
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">Lossless ZIP</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">1-Click Full Archive Export</p>
          </div>
        </div>
      </motion.div>

      {/* Wedding QR Cards List */}
      <div className="space-y-8">
        {WEDDING_ALBUMS.map((album, index) => {
          const albumUrl = getAlbumUrl(album.id);
          const isCopied = copiedId === album.id;

          return (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-3xl bg-white dark:bg-slate-900/70 border border-gray-200/80 dark:border-white/[0.08] p-6 sm:p-8 shadow-xl backdrop-blur-xl text-left overflow-hidden relative"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Scannable Live QR Code Card */}
                <div className="lg:col-span-4 flex flex-col items-center p-5 rounded-2xl bg-gray-50 dark:bg-slate-950/80 border border-gray-200/80 dark:border-white/[0.06] text-center">
                  
                  {/* The Live Scannable QR Code */}
                  <div className="p-3.5 rounded-2xl bg-white shadow-md border border-gray-100 dark:border-white/10 mb-4 inline-block">
                    <QRCodeSVG
                      id={`qr-svg-${album.id}`}
                      value={albumUrl}
                      size={180}
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-indigo-500" />
                    Scan with Phone Camera
                  </span>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 max-w-[200px]">
                    Instantly opens the 25-photo live gallery without installing an app
                  </p>

                  {/* Actions for this QR Code */}
                  <div className="w-full space-y-2 mt-5">
                    <Link
                      to={`/event/${album.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Album (25 Photos)</span>
                    </Link>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleDownloadPrintablePass(album)}
                        className="py-2 px-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
                        title="Download 300 DPI Printable Table Card"
                      >
                        <Download className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Print Pass</span>
                      </button>

                      <button
                        onClick={() => handleCopyLink(album.id)}
                        className="py-2 px-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side: Album & Client Details */}
                <div className="lg:col-span-8 space-y-5">
                  
                  {/* Top Header */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {album.badge}
                      </span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        ● 25 Raw Photos Included
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                      {album.couple}
                    </h2>
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {album.title}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 dark:text-slate-300">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200/60 dark:border-slate-800">
                      <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-gray-900 dark:text-white block truncate">{album.venue}</span>
                        <span className="text-[11px] text-gray-500 dark:text-slate-400">{album.city}, {album.state}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200/60 dark:border-slate-800">
                      <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-gray-900 dark:text-white block">{album.date}</span>
                        <span className="text-[11px] text-gray-500 dark:text-slate-400">{album.guestCount} Attending Guests</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200/60 dark:border-slate-800">
                      <Award className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-gray-900 dark:text-white block truncate">{album.photographer}</span>
                        <span className="text-[11px] text-gray-500 dark:text-slate-400">Lead Wedding Photographer</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200/60 dark:border-slate-800">
                      <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-gray-900 dark:text-white block">{album.theme}</span>
                        <span className="text-[11px] text-gray-500 dark:text-slate-400">Curated Wedding Narrative</span>
                      </div>
                    </div>
                  </div>

                  {/* Narrative Story */}
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-relaxed italic border-l-2 border-indigo-500/50 pl-3">
                    "{album.story}"
                  </p>

                  {/* 6-Photo Thumbnail Preview Ribbon */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                        Preview Shots from this Album
                      </span>
                      <Link
                        to={`/event/${album.id}`}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        View all 25 photos →
                      </Link>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {album.images.slice(0, 6).map((img, i) => (
                        <Link
                          key={img.id}
                          to={`/event/${album.id}`}
                          className="relative aspect-square rounded-xl overflow-hidden bg-slate-800 group shadow-sm"
                        >
                          <img
                            src={img.url}
                            alt={img.caption}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                          {i === 5 && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-white font-bold text-xs">
                              +19
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
