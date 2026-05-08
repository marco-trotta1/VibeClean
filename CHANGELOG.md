# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.2.0] - 2026-04-16

### Changed
- Renamed package to `badvibes` (published as `npx badvibes`)
- CLI command is now `badvibes` instead of `vibescore`
- Report header updated to `💀 BadVibes Report`

## [0.1.0] - 2026-04-16

### Added
- Initial release.
- Zero-config CLI that audits a repo and returns a Vibe Score from 0 to 100.
- Human-readable terminal report and `--json` output.
- `--strict` flag (harsher scoring, non-zero exit when score < 70 or any critical issue).
- `--no-funny` flag for dry verdict output.
- `--max-file-lines <n>` to override the large-file threshold.
- 12 deterministic checks: env example, secrets, tests, large files, markers,
  placeholders, duplicates, unused deps, naming, CI, README, broken imports.
- Programmatic API via `import { analyze } from 'badvibes'`.
- Score bands: Pristine, Clean, Neutral, Needs Rebuild, Nuke it.

[Unreleased]: https://github.com/marco-trotta1/badvibes/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/marco-trotta1/badvibes/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/marco-trotta1/badvibes/releases/tag/v0.1.0
