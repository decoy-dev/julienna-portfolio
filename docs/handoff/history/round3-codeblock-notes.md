# Round 3: Code block visual notes (item 4, optional input for Main)

For the AiBento cell-a dark code cell. Take or leave; you own implementation.

## Exact source (9 lines, ships complete in HTML, filename `render-campaign.ts`)

```ts
// Simplified from the real generator
import { personas, brandKits, templates } from './kits';

const persona = personas.get('dr-v-frizzle');
const kit = brandKits.for(persona, 'sample-practice');
const template = templates.get('split-stack');
const content = brief.slots(template, { copy, photo, logo });

render(persona, kit, template, content).map(write); // rules only, no LLM
```

The `// Simplified from the real generator` comment is the required marking; living inside the literal code, it survives every state including no-JS.

## Exact terminal output (gate word padded to 10 chars, two/three spaces as shown)

```
$ node render-campaign.ts
persona    ok   dr-v-frizzle (The Wellness Educator)
brand kit  ok   sample-practice (overrides applied)
template   ok   split-stack (5 slots, Story and Post)
content    ok   4 of 4 slots filled
render          Seasonal_Summer-2026_Image_V1_Story_SamplePractice
                ... 7 more files
done            8 files for sample-practice
```

No timing values, no fake durations (placeholder policy: no plausible fake data).

## Syntax colors on ink (teal + neutrals only, 4 roles)

- `oklch(1 0 0)`: keywords (`import`, `const`), and the terminal `done` line at 600 weight.
- `oklch(0.72 0.1 188)` (graphic): string literals and every `ok` token.
- `oklch(0.78 0.02 215)` (on-ink-muted): identifiers, punctuation, terminal body, file names.
- `oklch(0.64 0.015 215)`: comments and the `$` prompt (~4.9:1 on ink, AA for code).

## Panes and control

- Code pane: keep the existing `.code` inset treatment, ~210px tall.
- Terminal pane below it, gap 10px: same radius-inset + inset ring white/0.08 but bg `oklch(0 0 0 / 0.28)`, min-height 118px, mono 0.75rem/1.7.
- "Run again": `btn btn-outline-invert btn-sm` + `ph:arrow-counter-clockwise` 16px, right side of the cell header row, `hidden` until JS arms (same pattern as the pipeline replay).

## Timing and gate sync (~2.8s total)

1. Autoplay once via `watchVisibility(cellA, 0.4)`; offscreen/hidden settles to final.
2. Typing ~340 chars at 4ms/char (~1.4s). Pre-tokenize into the 4 color spans server-side; JS reveals char by char inside spans (newlines/indent instant). Caret: 8x14px `graphic` block after the last revealed char, removed when typing completes. No blink loop.
3. Terminal lines append every 160ms, each fading 0->1 over 120ms.
4. Gate sync: cell-c's five `<li>` get `data-gate` in order. The instant each `ok` line appends, its gate ticks: persona -> 1, brand kit -> 2, template -> 3, content -> 4, `done` line -> 5 ("Render").
5. Gate visuals: pending = 20px circle, inset 1.5px `line` ring, no icon, text muted. Done = `bg-graphic-tint` circle + `ph:check-bold` 11px `graphic-deep`, text ink, 200ms crossfade. Server ships all five done; JS resets to pending only when motion is allowed and a run is starting.

Finished static state (= no-JS = reduced motion): full code, no caret, full terminal, all gates checked.
