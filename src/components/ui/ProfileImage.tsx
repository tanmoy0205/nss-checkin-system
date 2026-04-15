"use client";

import { useState } from "react";
import { User } from "lucide-react";

interface ProfileImageProps {
  src?: string;
  alt: string;
  className?: string;
  size?: number;
}

export function ProfileImage({ src, alt, className, size = 32 }: ProfileImageProps) {
  const [error, setError] = useState(false);

  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=random`;

  if (!src) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center text-gray-400 ${className}`}>
        <User size={size} />
      </div>
    );
  }

  return (
    <img
      src={error ? fallbackUrl : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
