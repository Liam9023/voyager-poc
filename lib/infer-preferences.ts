import type { DecisionStyle, Pacing } from "@/types";

/**
 * Lightweight keyword inference for conversation-mode onboarding (POC_followup_prompt.md
 * item 2). Real structured extraction would need a second model call; for the POC we scan
 * what the traveller actually typed and only set a preference when the signal is clear —
 * otherwise the trip-store defaults (balanced / show_options) stand.
 */
const PACING_SIGNALS: [RegExp, Pacing][] = [
  [/\b(relax(ed)?|slow|easy|chill(ed)?|laid.?back|not much planned|nothing planned|take it easy)\b/i, "relaxed"],
  [/\b(pack(ed)?|jam.?packed|action.?packed|see everything|fit (it |lots )?in|busy schedule|go go go)\b/i, "packed"],
];

const DECISION_SIGNALS: [RegExp, DecisionStyle][] = [
  [/\b(you decide|surprise us|whatever you (think|recommend)|you choose|up to you|your call|just pick)\b/i, "decide_for_me"],
  [
    /\b(we (already )?know|specific(ally)? want|must.?see|has to include|need(s)? to include|already have|booked already|we want to go to)\b/i,
    "know_what_i_want",
  ],
];

export function inferPacingAndDecisionStyle(text: string): { pacing?: Pacing; decisionStyle?: DecisionStyle } {
  const result: { pacing?: Pacing; decisionStyle?: DecisionStyle } = {};
  for (const [pattern, pacing] of PACING_SIGNALS) {
    if (pattern.test(text)) {
      result.pacing = pacing;
      break;
    }
  }
  for (const [pattern, style] of DECISION_SIGNALS) {
    if (pattern.test(text)) {
      result.decisionStyle = style;
      break;
    }
  }
  return result;
}
