"use client";
import { useEffect, useRef, useState } from "react";

export function StoryProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    let available = 1;
    const measure = () => { available = Math.max(1, document.documentElement.scrollHeight - innerHeight); update(); };
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollY / available))})`;
        frame = 0;
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", measure, { passive: true });
    measure();
    return () => { observer.disconnect(); removeEventListener("scroll", update); removeEventListener("resize", measure); cancelAnimationFrame(frame); };
  }, []);
  return <div ref={bar} className="ink-progress" aria-hidden="true" />;
}

export function ShareStory() {
  const [label, setLabel] = useState("SHARE STORY");
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: "Lucknow AI Growth Journey", url: location.href });
      else { await navigator.clipboard.writeText(location.href); setLabel("LINK COPIED!"); setTimeout(() => setLabel("SHARE STORY"), 1800); }
    } catch { setLabel("SHARE STORY"); }
  }
  return <button type="button" onClick={share}>{label} ↗</button>;
}
