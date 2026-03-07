"use client";

import { useState } from "react";

type ImageWithLoadingProps = {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  fill?: boolean;
  sizes?: string;
};

export function ImageWithLoading({
  src,
  alt,
  className = "h-full w-full object-cover",
  wrapperClassName = "",
  fill = true,
  sizes,
}: ImageWithLoadingProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 ${wrapperClassName}`}
      style={fill ? { position: "relative", width: "100%", height: "100%" } : undefined}
    >
      {!loaded && !error && (
        <div
          className="absolute inset-0 animate-pulse bg-slate-200"
          aria-hidden
        />
      )}
      {error ? (
        <div className="flex h-full w-full items-center justify-center bg-slate-200">
          <span className="text-4xl font-bold text-slate-400" aria-hidden>
            ?
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
          style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : undefined}
          sizes={sizes}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
