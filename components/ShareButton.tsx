'use client';

import { useState } from 'react';

interface ShareButtonProps {
  title: string;
  url: string;
  currentLang: string;
  className?: string;
}

export default function ShareButton({ title, url, currentLang, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy to clipboard', error);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center justify-center space-x-1 sm:space-x-2 py-2.5 sm:py-3 px-3 sm:px-4 bg-background border border-border text-foreground font-medium rounded-xl hover:bg-secondary/50 transition-all duration-300 text-xs sm:text-sm ${className}`}
    >
      <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
      </svg>
      <span>
        {copied 
          ? (currentLang === "en" ? "Copied!" : "Gekopieerd!")
          : (currentLang === "en" ? "Share" : "Delen")
        }
      </span>
    </button>
  );
}