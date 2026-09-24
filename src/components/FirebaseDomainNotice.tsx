import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { notify } from '../lib/toast';

interface FirebaseDomainNoticeProps {
  onUseEmailFallback?: () => void;
  onUseDemoAdmin?: () => void;
}

export function FirebaseDomainNotice({ onUseEmailFallback, onUseDemoAdmin }: FirebaseDomainNoticeProps) {
  const [copied, setCopied] = useState(false);
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const firebaseSettingsUrl = 'https://console.firebase.google.com/project/lensdrop-325dd/authentication/settings';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentHostname);
    setCopied(true);
    notify.success('Domain copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1 text-left">
          <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
            Google Sign-In: Unauthorized Domain
          </h4>
          <p className="text-xs text-amber-800/90 dark:text-amber-300/80 mt-1 leading-relaxed">
            Firebase Google OAuth requires adding this preview domain to your Firebase Authorized Domains list before Google popup can complete.
          </p>

          {/* Current Domain Box with 1-click Copy */}
          <div className="mt-3 p-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-amber-500/30 flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-gray-800 dark:text-slate-200 truncate select-all">
              {currentHostname}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Domain'}</span>
            </button>
          </div>

          {/* Steps */}
          <div className="mt-3 text-[11px] text-amber-800/80 dark:text-amber-300/70 space-y-1">
            <p>1. Copy the domain above.</p>
            <p>2. Open Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains.</p>
            <p>3. Click <strong>Add domain</strong>, paste it, and save.</p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-amber-500/20">
            <a
              href={firebaseSettingsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
            >
              <span>Open Firebase Settings</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {onUseDemoAdmin && (
              <>
                <span className="text-amber-500/40">•</span>
                <button
                  type="button"
                  onClick={onUseDemoAdmin}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Enter as Admin (kusprince.raj@gmail.com)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
