'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareModalProps {
  shareId: string;
  title: string;
  onClose: () => void;
}

export default function ShareModal({ shareId, title, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/share/${shareId}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Copy failed — select the URL manually.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-white/7 bg-[#18181d] shadow-modal p-5 space-y-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-1">Share Drama</p>
            <p className="text-xs text-ink-3 mt-0.5 truncate max-w-[220px]">{title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-4 hover:text-ink-1 hover:bg-white/6 transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* URL field */}
        <div className="rounded-xl border border-white/7 bg-[#111115] px-3 py-2.5">
          <p className="text-2xs text-ink-4 uppercase tracking-widest font-semibold mb-1.5">Share Link</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-ink-2 font-mono flex-1 truncate">{shareUrl}</p>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 p-1 text-ink-4 hover:text-ink-1 transition-colors"
            >
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Copy button */}
        <motion.button
          onClick={copy}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all
            ${copied
              ? 'bg-green-500/12 border border-green-500/25 text-green-400'
              : 'bg-amber-500/12 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
        >
          {copied
            ? <><Check size={14} /> Copied!</>
            : <><Copy size={14} /> Copy Link</>
          }
        </motion.button>

        <p className="text-center text-2xs text-ink-4">Anyone with this link can view the drama</p>
      </motion.div>
    </motion.div>
  );
}
