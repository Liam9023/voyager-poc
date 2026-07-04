import type { Expense } from "@/types";

export interface TravellerBalance {
  name: string;
  paid: number;
  owed: number;
  /** paid - owed. Positive: is owed money by the group. Negative: owes the group. */
  net: number;
}

/**
 * Splitwise-style ledger math — tracking and calculation only, no real money movement
 * (POC_followup_prompt.md item 15). Each expense splits evenly across its `splitWith` list;
 * the payer is credited the full amount and every participant (payer included) is debited
 * their even share.
 */
export function computeBalances(expenses: Expense[], travellers: readonly string[]): TravellerBalance[] {
  const paid: Record<string, number> = {};
  const owed: Record<string, number> = {};
  for (const t of travellers) {
    paid[t] = 0;
    owed[t] = 0;
  }

  for (const e of expenses) {
    paid[e.paidBy] = (paid[e.paidBy] ?? 0) + e.amount;
    const participants = e.splitWith.length > 0 ? e.splitWith : travellers;
    const share = e.amount / participants.length;
    for (const p of participants) {
      owed[p] = (owed[p] ?? 0) + share;
    }
  }

  return travellers.map((name) => ({
    name,
    paid: round2(paid[name] ?? 0),
    owed: round2(owed[name] ?? 0),
    net: round2((paid[name] ?? 0) - (owed[name] ?? 0)),
  }));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
