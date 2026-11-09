"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { projectCover } from "@/lib/project-cover";

export default function ProjectImageSlider({
  images,
  category,
  label,
}: {
  images: string[];
  category: string;
  label: string;
}) {
  const slides = images.length ? images : [projectCover(category)];
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(slides.length > 1);

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, slides.length - 1));
    setPlaying(slides.length > 1);
  }, [slides.length]);

  useEffect(() => {
    if (!playing || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [playing, slides.length]);

  return (
    <div
      className="group relative h-full w-full overflow-hidden"
      role="region"
      aria-label={`${label} images`}
      aria-roledescription="carousel"
    >
      <div
        className="flex h-full w-full transition-transform duration-500 motion-reduce:transition-none"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="h-full w-full shrink-0"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
            aria-hidden={index !== activeIndex}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={label} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setActiveIndex((index) => (index - 1 + slides.length) % slides.length)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#171816] opacity-0 shadow transition-opacity hover:bg-white focus:opacity-100 group-hover:opacity-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((index) => (index + 1) % slides.length)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#171816] opacity-0 shadow transition-opacity hover:bg-white focus:opacity-100 group-hover:opacity-100"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/45 px-2 py-1.5">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === activeIndex}
                className={`h-2 rounded-full transition-all ${index === activeIndex ? "w-5 bg-white" : "w-2 bg-white/60 hover:bg-white"}`}
              />
            ))}
            <button
              type="button"
              onClick={() => setPlaying((current) => !current)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              className="ml-1 grid h-5 w-5 place-items-center text-white"
            >
              {playing ? <Pause size={12} /> : <Play size={12} />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
