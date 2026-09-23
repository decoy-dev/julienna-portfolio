/**
 * Pipeline choreography for one tabpanel. Markup contract:
 *   [data-stage]              ordered stage nodes
 *   path[data-stage-edge]     edge i connects stage i to stage i+1
 *   path[data-link]           link k feeds output k (first link leaves the last stage)
 *   [data-output]             ordered output nodes; each may contain
 *     [data-item][data-name]    revealed one by one; names stream into [data-ticker]
 *     [data-wave]               CSS-driven fill wave (state toggled once)
 *     [data-count]              number counted up from 0
 *   [data-ticker][data-final] live file name; `data-final` is its resting text
 *   circle.packet             packet pool
 *   [data-status]             polite live region, announced once per completed run
 * Markup ships in the finished state (no JS, reduced motion). `reset` puts it in the ready state.
 */
import { MotionScope, reducedMotion, sendPacket } from './graph';

const STATEFUL = '[data-stage], [data-output], [data-item], [data-wave], path.edge';

export type PipelineRunner = { play(): void; finish(): void; reset(): void };

export function createPipelineRunner(panel: HTMLElement): PipelineRunner {
  const stages = [...panel.querySelectorAll<HTMLElement>('[data-stage]')];
  const stageEdges = [...panel.querySelectorAll<SVGPathElement>('path[data-stage-edge]')];
  const links = [...panel.querySelectorAll<SVGPathElement>('path[data-link]')];
  const outputs = [...panel.querySelectorAll<HTMLElement>('[data-output]')];
  const dots = [...panel.querySelectorAll<SVGCircleElement>('circle.packet')];
  const stateful = [...panel.querySelectorAll<HTMLElement | SVGElement>(STATEFUL)];
  const counters = [...panel.querySelectorAll<HTMLElement>('[data-count]')];
  const ticker = panel.querySelector<HTMLElement>('[data-ticker]');
  const status = panel.querySelector<HTMLElement>('[data-status]');
  let scope = new MotionScope();

  const setState = (state: string) => {
    for (const el of stateful) el.dataset.state = state;
  };

  const finish = () => {
    scope.cancel();
    setState('done');
    for (const c of counters) c.textContent = c.dataset.count!;
    if (ticker) ticker.textContent = ticker.dataset.final ?? '';
    for (const d of dots) d.setAttribute('opacity', '0');
  };

  const reset = () => {
    scope.cancel();
    setState('');
    for (const c of counters) c.textContent = '0';
    if (ticker) ticker.textContent = ticker.dataset.idle ?? '';
    if (status) status.textContent = '';
  };

  const play = async () => {
    if (reducedMotion.matches) return finish();
    reset();
    const s = (scope = new MotionScope());
    let d = 0;
    const travel = async (edge: SVGPathElement | undefined, ms: number) => {
      if (!edge || !s.alive) return;
      edge.dataset.state = 'active';
      await sendPacket(s, edge, dots[d++ % dots.length], ms);
      if (s.alive) edge.dataset.state = 'done';
    };

    await s.wait(250);
    for (let i = 0; i < stages.length; i++) {
      if (!s.alive) return;
      stages[i].dataset.state = 'active';
      await s.wait(320);
      if (!s.alive) return;
      stages[i].dataset.state = 'done';
      await travel(i < stages.length - 1 ? stageEdges[i] : links[0], 420);
    }

    for (let k = 0; k < outputs.length; k++) {
      if (k > 0) await travel(links[k], 480);
      if (!s.alive) return;
      const out = outputs[k];
      out.dataset.state = 'active';
      for (const item of out.querySelectorAll<HTMLElement>('[data-item]')) {
        item.dataset.state = 'done';
        if (ticker && item.dataset.name) ticker.textContent = item.dataset.name;
        await s.wait(120);
        if (!s.alive) return;
      }
      const wave = out.querySelector<HTMLElement>('[data-wave]');
      if (wave) wave.dataset.state = 'done';
      const counter = out.querySelector<HTMLElement>('[data-count]');
      if (counter) {
        const n = { v: 0 };
        await s.animate(n, {
          v: Number(counter.dataset.count),
          duration: 1100,
          ease: 'outQuart',
          onUpdate: () => (counter.textContent = String(Math.round(n.v))),
        });
      } else if (wave) await s.wait(900);
      if (!s.alive) return;
      out.dataset.state = 'done';
    }
    if (ticker) ticker.textContent = ticker.dataset.final ?? '';
    if (status) status.textContent = status.dataset.message ?? '';
  };

  // Turning on reduced motion mid-run settles the demo into its readable final state.
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) finish();
  });

  return { play: () => void play(), finish, reset };
}
