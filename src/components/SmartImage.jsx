import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

export default function SmartImage({
  src,
  alt,
  className = '',
  fallbackLabel = 'Room-mate Stay',
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-navy-800 via-navy-700 to-slate-800 text-white/90 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Building2 className="w-8 h-8 mb-1.5 text-accent" />
        <span className="text-xs font-medium px-3 text-center opacity-85 line-clamp-1">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-slate-200" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
