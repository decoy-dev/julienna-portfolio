/**
 * Shared lane runner for the pipeline sections (AdGenerator.astro, PhotoIntake.astro); each
 * section's choreography lives in its own module (ad-generator.ts, photo-intake.ts). Markup contract:
 *   [data-stage]              nodes that go idle -> active -> done
 *   path.edge                 idle grey until a packet crosses it, then done
 *   [data-output]             the output node, containing
 *     [data-item][data-name]    revealed one by one; names stream into [data-ticker]
 *   [data-ticker][data-final] live file name; `data-final` is its resting text
 *   .packet                   packet pool (one per concurrent flight; circles or thumbnail rects)
 * Markup ships in the finished state (no JS, reduced motion); it stays that way until a run
 * actually starts. `finish` and `reset` apply instantly: `data-instant` on the lane suppresses CSS
 * transitions and pending transition delays for two frames, so settling never trails off.
 */
import { MotionScope, reducedMotion, sendPacket } from './graph';

export type LaneRunner = {
  /** Resolves true when the run finished, false when it was superseded or settled early. */
  play(): Promise<boolean>;
  finish(): void;
  reset(): void;
};

/** Primitives one run's choreography is written in. Every one of them bails once the run is cancelled. */
export type Run = {
  scope: MotionScope;
  /** Node active for `ms`, then done. False when the run was cancelled. */
  step(node: HTMLElement | null, ms: number): Promise<boolean>;
  /** One packet along an edge; the edge lights while it travels and stays done after. */
  travel(edge: SVGPathElement | null | undefined, ms: number): Promise<void>;
  /** Fill the output item by item, streaming names into the ticker. False when cancelled. */
  reveal(every: number): Promise<boolean>;
};

export type LaneSpec = {
  lane: HTMLElement;
  choreography(run: Run): Promise<boolean>;
  onReset?(): void;
  onFinish?(): void;
};

const STATEFUL = '[data-stage], [data-output], [data-item], path.edge';

export function createLaneRunner({ lane, choreography, onReset, onFinish }: LaneSpec): LaneRunner {
  const stateful = [...lane.querySelectorAll<HTMLElement | SVGElement>(STATEFUL)];
  const dots = [...lane.querySelectorAll<SVGGraphicsElement>('.packet')];
  const output = lane.querySelector<HTMLElement>('[data-output]');
  const items = [...lane.querySelectorAll<HTMLElement>('[data-item]')];
  const ticker = lane.querySelector<HTMLElement>('[data-ticker]');
  let scope = new MotionScope();
  let nextDot = 0;

  const setState = (state: string) => {
    for (const el of stateful) el.dataset.state = state;
  };
  let instantFrame = 0;
  const instantly = (apply: () => void) => {
    cancelAnimationFrame(instantFrame);
    lane.dataset.instant = '';
    apply();
    instantFrame = requestAnimationFrame(() => {
      instantFrame = requestAnimationFrame(() => delete lane.dataset.instant);
    });
  };

  const finish = () => {
    scope.cancel();
    instantly(() => {
      setState('done');
      if (ticker) ticker.textContent = ticker.dataset.final ?? '';
      for (const d of dots) d.setAttribute('opacity', '0');
      onFinish?.();
    });
  };

  const reset = () => {
    scope.cancel();
    instantly(() => {
      setState('');
      if (ticker) ticker.textContent = ticker.dataset.idle ?? '';
      onReset?.();
    });
  };

  const play = async () => {
    if (reducedMotion.matches) {
      finish();
      return true;
    }
    reset();
    const s = (scope = new MotionScope());
    // Let the instant reset clear (two frames) so the run's first transitions animate.
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    if (!s.alive) return false;
    return choreography({
      scope: s,
      async step(node, ms) {
        if (!node || !s.alive) return false;
        node.dataset.state = 'active';
        await s.wait(ms);
        if (!s.alive) return false;
        node.dataset.state = 'done';
        return true;
      },
      async travel(edge, ms) {
        if (!edge || !s.alive) return;
        edge.dataset.state = 'active';
        await sendPacket(s, edge, dots[nextDot++ % dots.length], ms);
        if (s.alive) edge.dataset.state = 'done';
      },
      async reveal(every) {
        if (!s.alive || !output) return false;
        output.dataset.state = 'active';
        for (const item of items) {
          item.dataset.state = 'done';
          if (ticker && item.dataset.name) ticker.textContent = item.dataset.name;
          await s.wait(every);
          if (!s.alive) return false;
        }
        output.dataset.state = 'done';
        if (ticker) ticker.textContent = ticker.dataset.final ?? '';
        return true;
      },
    });
  };

  // Turning on reduced motion mid-run settles the lane into its readable final state.
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) finish();
  });

  return { play, finish, reset };
}
