"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useId, useState, type FocusEvent, type PointerEvent } from "react";

interface ProjectPreviewProps {
  title: string;
  desktopImage: string;
  mobileImage: string;
  projectUrl: string;
}

export default function ProjectPreview({
  title,
  desktopImage,
  mobileImage,
  projectUrl,
}: ProjectPreviewProps) {
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const pathId = `visit-project-circle-${useId().replaceAll(":", "")}`;

  function updateCursor(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !projectUrl) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setCursor({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      visible: true,
    });
  }

  function centerCursor(event: FocusEvent<HTMLAnchorElement>) {
    const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!bounds) return;
    setCursor({ x: bounds.width / 2, y: bounds.height / 2, visible: true });
  }

  return (
    <div
      className="showcase-project-visual"
      aria-label={`${title} project previews`}
      onPointerEnter={updateCursor}
      onPointerMove={updateCursor}
      onPointerLeave={() => setCursor((current) => ({ ...current, visible: false }))}
    >
      <div className="showcase-project-glow" />
      <div className="showcase-desktop-preview">
        <div className="showcase-browser-bar" aria-hidden="true">
          <i /><i /><i />
          <span>{title}</span>
        </div>
        <Image
          src={desktopImage}
          alt={`${title} desktop preview`}
          fill
          sizes="(max-width: 760px) 90vw, 58vw"
          unoptimized
        />
      </div>
      <div className="showcase-mobile-preview">
        <div className="showcase-mobile-bar" aria-hidden="true"><i /></div>
        <Image
          src={mobileImage}
          alt={`${title} mobile preview`}
          fill
          sizes="(max-width: 760px) 36vw, 18vw"
          unoptimized
        />
      </div>
      {projectUrl && (
        <a
          className={`project-visit-cursor${cursor.visible ? " is-visible" : ""}`}
          href={projectUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Visit ${title}`}
          style={{ left: cursor.x, top: cursor.y }}
          onFocus={centerCursor}
          onBlur={() => setCursor((current) => ({ ...current, visible: false }))}
        >
          <svg className="project-visit-label" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <path id={pathId} d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
            </defs>
            <text>
              <textPath href={`#${pathId}`}>VISIT PROJECT · VISIT PROJECT ·</textPath>
            </text>
          </svg>
          <ArrowUpRight size={25} strokeWidth={1.8} />
        </a>
      )}
    </div>
  );
}
