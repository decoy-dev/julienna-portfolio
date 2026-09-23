/**
 * Choreography for one pipeline lane. Markup contract:
 *   [data-stage]              ordered step nodes
 *   path[data-stage-edge]     edge i connects step i to step i+1
 *   path[data-link]           edge from the last step into the output node
 *   [data-output]             the output node; may contain
 *     [data-item][data-name]    revealed one by one; names stream into [data-ticker]
 *   [data-ticker][data-final] live file name; `data-final` is its resting text
 *   circle.packet             packet pool
 * Markup ships in the finished state (no JS, reduced motion). `reset` puts it in the ready state.
 * Timings keep a full lane under ~3s so autoplay stays well inside WCAG 2.2.2's 5s limit.
 */
import { MotionScope, reducedMotion, sendPacket } from './graph';

const STATEFUL = '[data-stage], [data-output], [data-item], path.edge';

export type PipelineTiming = { step: number; travel: number; item: number };
export type PipelineRunner = {
  /** Resolves true when the run finished, false when it was superseded or settled early. */
  play(): Promise<boolean>;
  finish(): void;
  reset(): void;
};

const DEFAULT_TIMING: PipelineTiming = { step: 160, travel: 280, item: 55 };

export function createPipelineRunner(lane: HTMLElement, timing: PipelineTiming = DEFAULT_TIMING): PipelineRunner {
  const stages = [...lane.querySelectorAll<HTMLElement>('[data-stage]')];
  const stageEdges = [...lane.querySelectorAll<SVGPathElement>('path[data-stage-edge]')];
  const link = lane.querySelector<SVGPathElement>('path[data-link]');
  const output = lane.querySelector<HTMLElement>('[data-output]');
  const items = [...lane.querySelectorAll<HTMLElement>('[data-item]')];
  const dots = [...lane.querySelectorAll<SVGCircleElement>('circle.packet')];
  const stateful = [...lane.querySelectorAll<HTMLElement | SVGElement>(STATEFUL)];
  const ticker = lane.querySelector<HTMLElement>('[data-ticker]');
  let scope = new MotionScope();

  const setState = (state: string) => {
    for (const el of stateful) el.dataset.state = state;
  };

  const finish = () => {
    scope.cancel();
    setState('done');
    if (ticker) ticker.textContent = ticker.dataset.final ?? '';
    for (const d of dots) d.setAttribute('opacity', '0');
  };

  const reset = () => {
    scope.cancel();
    setState('');
    if (ticker) ticker.textContent = ticker.dataset.idle ?? '';
  };

  const play = async () => {
    if (reducedMotion.matches) {
      finish();
      return true;
    }
    reset();
    const s = (scope = new MotionScope());
    let d = 0;
    const travel = async (edge: SVGPathElement | null | undefined) => {
      if (!edge || !s.alive) return;
      edge.dataset.state = 'active';
      await sendPacket(s, edge, dots[d++ % dots.length], timing.travel);
      if (s.alive) edge.dataset.state = 'done';
    };

    for (let i = 0; i < stages.length; i++) {
      if (!s.alive) return false;
      stages[i].dataset.state = 'active';
      await s.wait(timing.step);
      if (!s.alive) return false;
      stages[i].dataset.state = 'done';
      await travel(i < stages.length - 1 ? stageEdges[i] : link);
    }
    if (!s.alive || !output) return false;
    output.dataset.state = 'active';
    for (const item of items) {
      item.dataset.state = 'done';
      if (ticker && item.dataset.name) ticker.textContent = item.dataset.name;
      await s.wait(timing.item);
      if (!s.alive) return false;
    }
    output.dataset.state = 'done';
    if (ticker) ticker.textContent = ticker.dataset.final ?? '';
    return true;
  };

  // Turning on reduced motion mid-run settles the lane into its readable final state.
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) finish();
  });

  return { play, finish, reset };
}
