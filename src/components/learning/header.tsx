"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tabPaths } from "@/lib/learning-routes";
import type { LearningState } from "@/hooks/use-learning";
import { VoiceSettings } from "./voice-settings";
import { StarCount } from "./star-count";
export function Header(state: LearningState) {
  const { tab, gold, silver, setPlaying } = state;
  const lesson = usePathname().match(
    /^\/learn\/(division|multiplication|percentages)\/[^/]+\/\d+$/,
  );
  const examplesHref = lesson ? `/learn/${lesson[1]}` : null;
  return (
    <header className="border-b border-[#e2e8de] bg-[#fffef9]">
      <div className="app-header mx-auto max-w-7xl px-5 py-5 md:px-10">
        <div className="header-leading">
          {examplesHref ? (
            <Link
              className="navbar-back-link"
              href={examplesHref}
              onClick={() => setPlaying(false)}
              aria-label="All example cards"
              title="All example cards"
            >
              <span aria-hidden="true">←</span>
              <span className="navbar-back-label">All example cards</span>
            </Link>
          ) : (
            <Link
              href="/"
              onClick={() => setPlaying(false)}
              className="brand flex items-center gap-3"
              aria-label="Little Orbit home"
            >
              <span className="brand-mark">✳</span> little orbit
              <span className="brand-dot">.</span>
            </Link>
          )}
        </div>
        <nav aria-label="Main navigation" className="flex gap-1 md:gap-6">
          {(
            [
              ["home", "My space"],
              ["lesson", "Learn"],
              ["game", "Play"],
            ] as const
          ).map(([id, name]) => (
            <Link
              key={id}
              className={`nav-link ${tab === id ? "active" : ""}`}
              href={tabPaths[id]}
              onClick={() => setPlaying(false)}
              aria-current={tab === id ? "page" : undefined}
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="header-status flex items-center gap-3">
          <span className="star-count header-optional">
            <StarCount gold={gold} silver={silver} />
          </span>
          <span className="avatar header-optional">A</span>
          <VoiceSettings />
        </div>
      </div>
    </header>
  );
}
