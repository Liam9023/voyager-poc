/** Pure formatting helpers shared between the server Places service and client pickers. */

const PRICE_LEVEL_LABEL: Record<string, string> = {
  PRICE_LEVEL_FREE: "free",
  PRICE_LEVEL_INEXPENSIVE: "$",
  PRICE_LEVEL_MODERATE: "$$",
  PRICE_LEVEL_EXPENSIVE: "$$$",
  PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
};

export function priceLevelLabelClient(level?: string): string | undefined {
  return level ? PRICE_LEVEL_LABEL[level] : undefined;
}
