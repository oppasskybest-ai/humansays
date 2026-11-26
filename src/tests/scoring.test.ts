import { describe, expect, it } from 'vitest';
import { scorePrediction, tierFromReputation } from '@/lib/predictions/scoring';

describe('prediction scoring', () => {
  it('gives +10 for a correct prediction, plus streak bonus capped at +10', () => {
    expect(scorePrediction('won', 0)).toBe(10);
    expect(scorePrediction('won', 2)).toBe(14);
    expect(scorePrediction('won', 9)).toBe(20);
  });
  it('gives 0 for wrong or void', () => {
    expect(scorePrediction('lost', 3)).toBe(0);
    expect(scorePrediction('void', 3)).toBe(0);
  });
  it('maps reputation to tiers', () => {
    expect(tierFromReputation(0)).toEqual({ name: 'Bronze', level: 0 });
    expect(tierFromReputation(100).name).toBe('Silver');
    expect(tierFromReputation(300).name).toBe('Gold');
    expect(tierFromReputation(5000)).toEqual({ name: 'Platinum', level: 3 });
  });
});
