"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";

type ImageLightboxProps = {
  src: string;
  alt: string;
  /** Visible caption under the enlarged image. */
  caption?: string;
  className?: string;
  children: ReactNode;
};

// Wraps a thumbnail in a link to the full image; with JS the link opens a native <dialog> popup instead.
export function ImageLightbox({ src, alt, caption, className, children }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <a
        aria-haspopup="dialog"
        aria-label={`Phóng to ảnh: ${alt}`}
        className={`cursor-zoom-in ${className ?? ""}`}
        href={src}
        onClick={(event) => {
          event.preventDefault();
          dialogRef.current?.showModal();
        }}
      >
        {children}
      </a>
      <dialog
        aria-label={alt}
        className="fixed inset-0 m-auto h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-5xl overflow-hidden rounded-2xl border-0 bg-transparent p-0 backdrop:bg-black/80"
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
        ref={dialogRef}
      >
        {/* pointer-events-none: any click inside the popup lands on the <dialog> itself and closes it. */}
        <figure className="pointer-events-none flex h-full flex-col">
          <div className="relative min-h-0 flex-1">
            <Image alt={alt} className="object-contain" fill sizes="(max-width: 1024px) 100vw, 1024px" src={src} />
          </div>
          {caption ? <figcaption className="shrink-0 px-4 pt-3 text-center text-sm font-medium text-white">{caption}</figcaption> : null}
        </figure>
        <button
          aria-label="Đóng ảnh"
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-2xl leading-none text-white transition hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-white"
          onClick={() => dialogRef.current?.close()}
          type="button"
        >
          ×
        </button>
      </dialog>
    </>
  );
}
