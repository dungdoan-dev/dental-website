"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import type { AboutImage } from "../data/about-content";

type Open = (images: readonly AboutImage[], index: number) => void;
const LightboxContext = createContext<Open>(() => {});

/** One photo viewer for the whole "Giới thiệu" section; images open it with their gallery and position. */
export function AboutLightboxProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<{ images: readonly AboutImage[]; index: number }>({ images: [], index: 0 });
  const open = useCallback<Open>((images, index) => {
    setState({ images, index });
    dialog.current?.showModal();
  }, []);
  const count = state.images.length;
  const step = useCallback((delta: number) => setState((s) => ({ ...s, index: (s.index + delta + s.images.length) % s.images.length })), []);
  const current = state.images[state.index];

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const onKey = (event: KeyboardEvent) => {
      if (count < 2) return;
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [count, step]);

  const navButton = "absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white";
  return (
    <LightboxContext.Provider value={open}>
      {children}
      <dialog
        aria-label={current?.caption ?? "Xem ảnh"}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-slate-950/92 p-0 backdrop:bg-transparent"
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
        ref={dialog}
      >
        {current ? (
          <div className="flex h-full items-center justify-center px-16 pb-6 pt-14" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
            <figure className="flex w-full max-w-[1200px] flex-col items-center">
              <div className="relative h-[calc(100dvh-170px)] w-full">
                <Image alt={current.alt} className="object-contain" fill sizes="(max-width: 1280px) 100vw, 1200px" src={current.full} />
              </div>
              <figcaption className="mt-3.5 text-center text-sm leading-relaxed text-white/90">
                {current.caption}
                {count > 1 ? <span className="mt-1 block text-xs tabular-nums text-white/65">{state.index + 1} / {count}</span> : null}
              </figcaption>
            </figure>
            <button aria-label="Đóng" autoFocus className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white" onClick={() => dialog.current?.close()} type="button"><Icon className="h-6 w-6" name="close" /></button>
            {count > 1 ? (
              <>
                <button aria-label="Ảnh trước" className={`${navButton} left-2`} onClick={() => step(-1)} type="button"><Icon className="h-7 w-7" name="chevron-left" /></button>
                <button aria-label="Ảnh kế tiếp" className={`${navButton} right-2`} onClick={() => step(1)} type="button"><Icon className="h-7 w-7" name="chevron-right" /></button>
              </>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </LightboxContext.Provider>
  );
}

type ZoomImageProps = {
  img: AboutImage;
  /** Gallery the viewer steps through; defaults to this image alone. */
  gallery?: readonly AboutImage[];
  index?: number;
  className?: string;
  style?: CSSProperties;
  fit?: "cover" | "contain";
  position?: string;
  sizes?: string;
  priority?: boolean;
};

/** A photo that opens the section's viewer. Give the wrapper an aspect ratio or height through className. */
export function ZoomImage({ img, gallery, index = 0, className = "", style, fit = "cover", position = "center", sizes = "(max-width: 768px) 100vw, 50vw", priority = false }: ZoomImageProps) {
  const open = useContext(LightboxContext);
  return (
    <button
      aria-label={`Xem ảnh lớn: ${img.caption}`}
      className={`relative block w-full cursor-zoom-in overflow-hidden rounded-md bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-blue-dark ${className}`}
      onClick={() => open(gallery ?? [img], gallery ? index : 0)}
      style={style}
      type="button"
    >
      <Image alt={img.alt} className={fit === "contain" ? "object-contain" : "object-cover"} fill priority={priority} sizes={sizes} src={img.src} style={{ objectPosition: position }} />
    </button>
  );
}
