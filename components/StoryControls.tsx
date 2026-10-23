"use client";
import { useState } from "react";

export function StoryProgress() {
  return <div className="ink-progress" aria-hidden="true" />;
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
