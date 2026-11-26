/**
 * Response quality checks (spec L7). Owner: Opeyemi. Each rule needs a unit test.
 * Result: no flags -> approved; flags -> flagged; failed attention check -> rejected.
 */
export type QualityFlag = 'too_fast' | 'straight_lining' | 'duplicate_text' | 'gibberish' | 'low_effort_ai';

export type QualityInput = {
  durationS: number;
  expectedMinS: number;
  speedFactor?: number;
  attentionChecksPassed: boolean;
  ratingAnswers: (string | number)[];
  textAnswers: string[];
};

export type QualityResult = { status: 'approved' | 'flagged' | 'rejected'; flags: QualityFlag[] };

export function evaluateResponse(_input: QualityInput): QualityResult {
  // TODO (L7): attention check -> rejected; speeder; straight-lining; duplicate/gibberish heuristics.
  throw new Error('evaluateResponse not implemented yet (L7)');
}
