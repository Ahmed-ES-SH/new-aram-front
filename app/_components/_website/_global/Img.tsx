/* eslint-disable @next/next/no-img-element */
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

    // cleanup only when component unmounts
    return () => {
      if (src.startsWith("blob:")) {
        URL.revokeObjectURL(src);
      }
    };
  }, [src]);

  const handleImageError = () => {
    if (errorSrc) setImageSrc(errorSrc);
  };

  const handleImageLoad = () => {
    // free memory only after load is done
    if (src.startsWith("blob:")) {
      URL.revokeObjectURL(src);
    }
    if (onLoad) onLoad();
  };

  return (
    <>
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
    </>
  );
}
