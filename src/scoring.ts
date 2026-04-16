import type { Issue, Report, ScoreBand } from './types.js';

export const BANDS: ScoreBand[] = [
  {
    name: 'Pristine',
    min: 90,
    max: 100,
    verdicts: ['Looks clean. Nothing meaningful to fix right now.'],
    dryVerdicts: ['No significant issues detected.'],
  },
  {
    name: 'Clean',
    min: 75,
    max: 89,
    verdicts: ['Solid overall. A few small things worth tightening.'],
    dryVerdicts: ['Minor issues present; nothing blocking.'],
  },
  {
    name: 'Neutral',
    min: 60,
    max: 74,
    verdicts: ['Functional, but worth cleaning up before shipping.'],
    dryVerdicts: ['Several issues worth addressing.'],
  },
  {
    name: 'Needs Rebuild',
    min: 40,
    max: 59,
    verdicts: ['Real structural problems. Plan some focused cleanup.'],
    dryVerdicts: ['Significant quality issues that will compound over time.'],
  },
  {
    name: 'Nuke it',
    min: 0,
    max: 39,
    verdicts: ['Hard to salvage without serious rework.'],
    dryVerdicts: ['Critical issues throughout; rewriting may be faster than fixing.'],
  },
];

export function bandFor(score: number): ScoreBand {
  const clamped = clampScore(score);
  for (const band of BANDS) {
    if (clamped >= band.min && clamped <= band.max) return band;
  }
  // Fallback — unreachable after clamp, but keeps TS happy.
  return BANDS[BANDS.length - 1]!;
}

export function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Strict mode amplifies penalties by a fixed factor. We keep it deterministic.
 */
export function applyStrictMultiplier(penalty: number, strict: boolean): number {
  if (!strict) return penalty;
  return Math.ceil(penalty * 1.5);
}

export function computeScore(issues: Issue[], strict: boolean): number {
  let score = 100;
  for (const issue of issues) {
    const penalty = issue.penalty ?? 0;
    score -= applyStrictMultiplier(penalty, strict);
  }
  return clampScore(score);
}

export function summarize(issues: Issue[]): Report['summary'] {
  return {
    critical: issues.filter((i) => i.severity === 'critical').length,
    warnings: issues.filter((i) => i.severity === 'warning').length,
    info: issues.filter((i) => i.severity === 'info').length,
  };
}

export function verdictFor(score: number, funny: boolean): string {
  const band = bandFor(score);
  const list = funny ? band.verdicts : band.dryVerdicts;
  return list[0] ?? '';
}
