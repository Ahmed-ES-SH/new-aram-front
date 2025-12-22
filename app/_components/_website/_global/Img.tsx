"use client";
import React, { useEffect, useState } from "react";

interface props {
  src: string;
  className: string;
  alt?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager" | undefined;
  priority?: boolean;
  onLoad?: () => void;
  onError?: (e) => void;
  errorSrc?: string;
  ref?: any;
}

export default function Img({
  src,
  className,
  width = 1024,
  height = 1280,
  alt = "image",
  loading = "lazy",
  onLoad,
  onError,
  errorSrc,
  ref,
}: props) {
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
    // لا تعمل revoke هنا؛ اللي أنشأ الـ URL هو المسؤول عن إلغاءه
  }, [src]);

  const handleImageError = () => {
    if (errorSrc) setImageSrc(errorSrc);
  };

  const handleImageLoad = () => {
    if (onLoad) onLoad();
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      onLoad={handleImageLoad}
      onError={onError ? onError : handleImageError}
      ref={ref}
    />
  );
}
