import path from 'node:path';
import chalk from 'chalk';
import type { Issue, Report } from '../types.js';
import { roastIssue } from '../roasts.js';

function formatLocation(issue: Issue): string {
  if (!issue.file) return '';
  if (issue.line != null && issue.line > 0) {
    return chalk.dim(`  (${issue.file}:${issue.line})`);
  }
  return chalk.dim(`  (${issue.file})`);
}

function section(
  title: string,
  color: (s: string) => string,
  issues: Issue[],
  roast: boolean,
): string {
  if (issues.length === 0) return '';
  const lines: string[] = [];
  lines.push('');
  lines.push(color(title));
  for (const issue of issues) {
    const message = roast ? roastIssue(issue) : issue.message;
    lines.push(`  ${color('-')} ${message}${formatLocation(issue)}`);
  }
  return lines.join('\n');
}

type Colorer = typeof chalk.green;

function bandColor(band: string): Colorer {
  switch (band) {
    case 'Pristine':
      return chalk.greenBright;
    case 'Clean':
      return chalk.green;
    case 'Neutral':
      return chalk.yellow;
    case 'Needs Rebuild':
      return chalk.redBright;
    case 'Nuke it':
      return chalk.red;
    default:
      return chalk.white;
  }
}

export interface HumanRenderOptions {
  funny: boolean;
  roast?: boolean;
  cwd?: string;
}

export function renderHuman(report: Report, opts: HumanRenderOptions): string {
  const lines: string[] = [];
  const relTarget = opts.cwd
    ? path.relative(opts.cwd, report.target) || '.'
    : report.target;
  const displayTarget = relTarget.startsWith('.') || path.isAbsolute(relTarget)
    ? relTarget
    : `./${relTarget}`;

  lines.push('');
  lines.push(chalk.bold(`💀 BadVibes Report for ${displayTarget}`));
  lines.push('');
  const color = bandColor(report.band);
  lines.push(
    `Vibe Score: ${color.bold(`${report.score}/100`)} ${chalk.dim(`(${report.band})`)}`,
  );
  if (report.strict) {
    lines.push(chalk.dim('Strict mode: on'));
  }

  const critical = report.issues.filter((i) => i.severity === 'critical');
  const warnings = report.issues.filter((i) => i.severity === 'warning');
  const info = report.issues.filter((i) => i.severity === 'info');

  const roast = opts.funny && opts.roast === true;

  lines.push(section('CRITICAL', chalk.red.bold, critical, roast));
  lines.push(section('WARNINGS', chalk.yellow.bold, warnings, roast));
  lines.push(section('INFO', chalk.cyan.bold, info, roast));

  if (critical.length + warnings.length + info.length === 0) {
    lines.push('');
    lines.push(chalk.green('No issues found. Suspiciously clean.'));
  }

  if (report.verdict && opts.funny) {
    lines.push('');
    lines.push(chalk.bold('Verdict:'));
    lines.push(chalk.italic(report.verdict));
  } else if (report.verdict && !opts.funny) {
    lines.push('');
    lines.push(chalk.bold('Verdict:'));
    lines.push(report.verdict);
  }

  lines.push('');
  return lines.filter((l) => l !== undefined).join('\n');
}
