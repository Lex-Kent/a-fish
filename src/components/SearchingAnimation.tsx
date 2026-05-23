'use client';

import { useState, useRef, useEffect } from 'react';

interface SearchingAnimationProps {
  isDark?: boolean;
}

export function SearchingAnimation({ isDark }: SearchingAnimationProps) {
  const videoRefDark = useRef<HTMLVideoElement>(null);
  const videoRefLight = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);

	const videoSrc = isDark ? 'videos/finSearchDark.mp4' : 'videos/finSearchLight.mp4';

  useEffect(() => {
    setMounted(true);

    // Start playing both videos
    videoRefDark.current?.play();
    videoRefLight.current?.play();
  }, []);

  return (
    <div className="relative w-48 h-48">
      {/* Rectangular mask with 30% edge fade */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-10" style={{
          background: isDark
            ? 'linear-gradient(to right, rgba(21, 27, 37, 1) 0%, transparent 30%, transparent 70%, rgba(21, 27, 37, 1) 100%), linear-gradient(to bottom, rgba(21, 27, 37, 1) 0%, transparent 30%, transparent 70%, rgba(21, 27, 37, 1) 100%)'
            : 'linear-gradient(to right, rgba(245, 245, 245, 1) 0%, transparent 30%, transparent 70%, rgba(245, 245, 245, 1) 100%), linear-gradient(to bottom, rgba(245, 245, 245, 1) 0%, transparent 30%, transparent 70%, rgba(245, 245, 245, 1) 100%)'
        }} />

        {/* Dark mode video */}
        <video
          ref={videoRefDark}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isDark ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Light mode video */}
        <video
          ref={videoRefLight}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isDark ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </div>
    </div>
  );
}
