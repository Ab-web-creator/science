"use client";
import { useId, useRef, type ReactNode } from "react";

export function HelpDialog({
  label,
  title,
  children,
  onOpen,
}: {
  label: string;
  title: string;
  children: ReactNode;
  /** e.g. read the hint aloud when Auto-play is on */
  onOpen?: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  return (
    <>
      <button
        className="text-button help-trigger"
        onClick={() => {
          ref.current?.showModal();
          onOpen?.();
        }}
      >
        {label}
      </button>
      <dialog ref={ref} className="help-dialog" aria-labelledby={id}>
        <h2 id={id}>{title}</h2>
        <div className="dialog-copy">{children}</div>
        <form method="dialog">
          <button className="button primary">Got it →</button>
        </form>
      </dialog>
    </>
  );
}
