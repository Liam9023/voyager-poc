"use client";

import type { ConflictIssue } from "@/types";

const KIND_LABEL: Record<ConflictIssue["kind"], string> = {
  overlap: "Time clash",
  fixed_clash: "Clashes with a booking",
  distance: "Tight on travel time",
};

/**
 * Surfaces conflicts after an Add/Remove/Swap edit. Never applies a fix on its own —
 * every proposal needs an explicit tap to confirm (POC_followup_prompt.md item 1).
 */
export default function ConflictSheet({
  issues,
  onAdjust,
  onLeave,
  onClose,
}: {
  issues: ConflictIssue[];
  onAdjust: (issue: ConflictIssue) => void;
  onLeave: (issue: ConflictIssue) => void;
  onClose: () => void;
}) {
  if (issues.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-fade-in-fast">
      <div className="w-full max-w-app rounded-t-[24px] bg-surface p-4 pb-5 shadow-lg">
        <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-amber">
          Heads up
        </div>
        <div className="mb-3 font-heading text-[16px] font-bold text-text">
          {issues.length === 1 ? "There's a clash to sort out" : `${issues.length} things to sort out`}
        </div>

        <div className="flex flex-col gap-2.5">
          {issues.map((issue, i) => (
            <div key={i} className="rounded-[14px] border border-amber-border bg-amber-light p-3">
              <div className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-amber">
                {KIND_LABEL[issue.kind]}
              </div>
              <div className="text-[12px] font-bold text-text">{issue.message}</div>
              <p className="mt-0.5 text-[11px] leading-snug text-text-mid">{issue.detail}</p>
              <div className="mt-2 flex gap-1.5">
                {issue.proposal && (
                  <button
                    onClick={() => onAdjust(issue)}
                    className="rounded-lg bg-accent px-3 py-1.5 text-[10.5px] font-bold text-white"
                  >
                    {issue.proposal.label}
                  </button>
                )}
                <button
                  onClick={() => onLeave(issue)}
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[10.5px] font-semibold text-text-mid"
                >
                  Leave it as is
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-3 w-full rounded-[12px] py-2 text-center text-[11px] font-semibold text-text-light"
        >
          Close
        </button>
      </div>
    </div>
  );
}
