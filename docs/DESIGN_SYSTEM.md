# Stride Free Design System

## Visual Direction

- Minimal athletic UI inspired by premium fitness apps
- Soft rounded cards with high-contrast metrics
- Brand palette: green (progress), orange (energy), cyan (insight)

## Theme Tokens

Defined in `src/index.css`:

- `--bg`
- `--surface`
- `--card`
- `--card-elevated`
- `--border`
- `--text-primary`
- `--text-secondary`
- `--text-muted`

Theme modes:

- Light
- Dark
- System

## Core Components

- `Button`
- `Card`
- `ScreenHeader`
- `ProgressRing`
- `SegmentTabs`
- `MetricsGrid`
- `WalkMap`

## Typography

- Headings: bold, compact tracking
- Labels: uppercase microcopy for glanceability
- Metrics: large numeric emphasis during active tracking

## Motion

- Route-level fade/slide transitions
- Button tap scale feedback
- Animated progress rings

## Layout Rules

- Mobile first: 4px spacing rhythm with card stack layout
- Max app width constrained for tablet/desktop (`max-w-3xl`)
- Bottom safe area reserved for navigation
