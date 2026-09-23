/**
 * Choreography for the two pipeline lanes. Shared markup contract:
 *   [data-stage]              nodes that go idle -> active -> done
 *   path.edge                 idle grey until a packet crosses it, then done
 *   [data-output]             the output node, containing
 *     [data-item][data-name]    revealed one by one; names stream into [data-ticker]
 *   [data-ticker][data-final] live file name; `data-final` is its resting text
 *   circle.packet             packet pool (one per concurrent flight)
 * Markup ships in the finished state (no JS, reduced motion). `reset` puts it in the ready state.
 * Each lane finishes in under 2.5s, so autoplay stays well inside WCAG 2.2.2's 5s limit.
 */
import { MotionScope, reducedMotion, sendPacket } from './graph';

export type LaneRunner = {
  /** Resolves true when the run finished, false when it was superseded or settled early. */
  play(): Promise<boolean>;
  finish(): void;
  reset(): void;
};

/** Primitives one run's choreography is written in. Every one of them bails once the run is cancelled. */
type Run = {
  scope: MotionScope;
  /** Node active for `ms`, then done. False when the run was cancelled. */
  step(node: HTMLElement | null, ms: number): Promise<boolean>;
  /** One packet along an edge; the edge lights while it travels and stays done after. */
  travel(edge: SVGPathElement | null | undefined, ms: number): Promise<void>;
  /** Fill the output item by item, streaming names into the ticker. False when cancelled. */
  reveal(every: number): Promise<boolean>;
};

type LaneSpec = {
  lane: HTMLElement;
  choreography(run: Run): Promise<boolean>;
  onReset?(): void;
  onFinish?(): void;
};

const STATEFUL = '[data-stage], [data-output], [data-item], path.edge';

function createLaneRunner({ lane, choreography, onReset, onFinish }: LaneSpec): LaneRunner {
  const stateful = [...lane.querySelectorAll<HTMLElement | SVGElement>(STATEFUL)];
  const dots = [...lane.querySelectorAll<SVGCircleElement>('circle.packet')];
  const output = lane.querySelector<HTMLElement>('[data-output]');
  const items = [...lane.querySelectorAll<HTMLElement>('[data-item]')];
  const ticker = lane.querySelector<HTMLElement>('[data-ticker]');
  let scope = new MotionScope();
  let nextDot = 0;

  const setState = (state: string) => {
    for (const el of stateful) el.dataset.state = state;
  };

  const finish = () => {
    scope.cancel();
    setState('done');
    if (ticker) ticker.textContent = ticker.dataset.final ?? '';
    for (const d of dots) d.setAttribute('opacity', '0');
    onFinish?.();
  };

  const reset = () => {
    scope.cancel();
    setState('');
    if (ticker) ticker.textContent = ticker.dataset.idle ?? '';
    onReset?.();
  };

  const play = async () => {
    if (reducedMotion.matches) {
      finish();
      return true;
    }
    reset();
    const s = (scope = new MotionScope());
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

type Persona = { name: string; type: string; color: string; count: string };

/**
 * Ad generator: four inputs fire in a quick cascade so their packets converge on Render almost
 * together, Render stamps, and the 8-file matrix fills. Each play advances to the next persona
 * (the frames re-tint through `--persona`, which AdFrame reads).
 */
export function createAdGenerator(lane: HTMLElement): LaneRunner {
  const inputs = [...lane.querySelectorAll<HTMLElement>('[data-input]')];
  const feeds = [...lane.querySelectorAll<SVGPathElement>('path[data-feed]')];
  const render = lane.querySelector<HTMLElement>('[data-render]');
  const link = lane.querySelector<SVGPathElement>('path[data-link]');
  const output = lane.querySelector<HTMLElement>('[data-output]');
  const name = lane.querySelector<HTMLElement>('[data-persona-name]');
  const type = lane.querySelector<HTMLElement>('[data-persona-type]');
  const count = lane.querySelector<HTMLElement>('[data-persona-count]');
  const personas: Persona[] = JSON.parse(lane.dataset.personas ?? '[]');
  let runs = 0;

  return createLaneRunner({
    lane,
    async choreography({ scope: s, step, travel, reveal }) {
      const p = personas[runs++ % personas.length];
      if (p && name && type && count && output) {
        name.textContent = p.name;
        type.textContent = p.type;
        count.textContent = p.count;
        output.style.setProperty('--persona', p.color);
      }
      await Promise.all(
        inputs.map(async (node, i) => {
          await s.wait(i * 140);
          if (await step(node, 160)) await travel(feeds[i], 420);
        }),
      );
      if (!(await step(render, 420))) return false;
      await travel(link, 280);
      return reveal(50);
    },
  });
}

/**
 * Photo intake: rejects drop out of the raw field while four feeds drain into Cull, the keepers
 * get their name stamp, and they empty out of the field as the four library bins fill.
 * The field's `data-phase` walks '' -> culled -> tagged -> sorted; CSS owns the tile motion.
 */
export function createPhotoIntake(lane: HTMLElement): LaneRunner {
  const field = lane.querySelector<HTMLElement>('[data-field]');
  const feeds = [...lane.querySelectorAll<SVGPathElement>('path[data-feed]')];
  const cull = lane.querySelector<HTMLElement>('[data-cull]');
  const namer = lane.querySelector<HTMLElement>('[data-namer]');
  const gate = lane.querySelector<SVGPathElement>('path[data-gate-edge]');
  const link = lane.querySelector<SVGPathElement>('path[data-link]');
  const phase = (p: string) => {
    if (field) field.dataset.phase = p;
  };

  return createLaneRunner({
    lane,
    onReset: () => phase(''),
    onFinish: () => phase('sorted'),
    async choreography({ scope: s, step, travel, reveal }) {
      phase('culled');
      if (cull) cull.dataset.state = 'active';
      await Promise.all(
        feeds.map(async (edge, i) => {
          await s.wait(120 + i * 90);
          await travel(edge, 420);
        }),
      );
      if (!(await step(cull, 160))) return false;
      await travel(gate, 260);
      if (!(await step(namer, 200))) return false;
      phase('tagged');
      await s.wait(300);
      await travel(link, 260);
      if (!s.alive) return false;
      phase('sorted');
      return reveal(90);
    },
  });
}
