/**
 * Prediction scoring + tiers (spec L8 / 8.5). REPUTATION ONLY: no Pi, no points, no money.
 * correct = +10, streak bonus +2 per consecutive correct (max +10), wrong/void = 0.
 * Owner: Opeyemi (L8).
 */
export const TIERS = [
  { name: 'Platinum', min: 700 },
  { name: 'Gold', min: 300 },
  { name: 'Silver', min: 100 },
  { name: 'Bronze', min: 0 },
] as const;

export function tierFromReputation(rep: number) {
  const idx = TIERS.findIndex((t) => rep >= t.min);
  const tier = TIERS[idx === -1 ? TIERS.length - 1 : idx];
  // numeric tier for campaigns.min_tier: Bronze 0, Silver 1, Gold 2, Platinum 3
  return { name: tier.name, level: TIERS.length - 1 - TIERS.indexOf(tier) };
}

export function scorePrediction(outcome: 'won' | 'lost' | 'void', consecutiveCorrectBefore: number): number {
  if (outcome !== 'won') return 0;
  const streakBonus = Math.min(2 * consecutiveCorrectBefore, 10);
  return 10 + streakBonus;
}
