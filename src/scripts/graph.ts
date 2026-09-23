/**
 * Node-graph engine shared by every graph surface (hero, pipeline, timeline, footer).
 *
 * Markup contract (DESIGN.md → Motif):
 *   <div data-graph>                         positioned root
 *     <svg data-edges> <path class="edge" data-from="a:out" data-to="b:in" /> </svg>
 *     <div data-node="a"> … </div>           any element; ports are virtual (derived from sides)
 *   </div>
 * Edges use tangents that leave a port along its side's normal, so graphs never draw diagonal
 * spaghetti. Layout is recomputed on resize only, never per frame.
 */
import { animate, type JSAnimation } from 'animejs/animation';

export type Side = 'in' | 'out' | 'down' | 'up';
type Pt = { x: number; y: number };

const NORMAL: Record<Side, Pt> = { in: { x: -1, y: 0 }, out: { x: 1, y: 0 }, down: { x: 0, y: 1 }, up: { x: 0, y: -1 } };

function portOf(rect: DOMRect, side: Side, origin: DOMRect): Pt {
  const x = rect.left - origin.left;
  const y = rect.top - origin.top;
  switch (side) {
    case 'in': return { x, y: y + rect.height / 2 };
    case 'out': return { x: x + rect.width, y: y + rect.height / 2 };
    case 'down': return { x: x + rect.width / 2, y: y + rect.height };
    case 'up': return { x: x + rect.width / 2, y };
  }
}

/** Cubic bezier between two ports; control arms follow each port's normal. */
export function edgePath(a: Pt, aSide: Side, b: Pt, bSide: Side): string {
  const na = NORMAL[aSide];
  const nb = NORMAL[bSide];
  const span = Math.hypot(b.x - a.x, b.y - a.y);
  const arm = Math.max(24, span * 0.45);
  const c1 = { x: a.x + na.x * arm, y: a.y + na.y * arm };
  const c2 = { x: b.x + nb.x * arm, y: b.y + nb.y * arm };
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

function parseEnd(spec: string): [string, Side] {
  const [id, side = 'out'] = spec.split(':');
  return [id, side as Side];
}

/**
 * Lay out every edge inside `root`. Returns a function that re-runs layout (rAF-coalesced).
 * When the root's CSS sets `--graph-compact: 1` (a breakpoint decision owned by CSS), paths use
 * their `data-from-compact` / `data-to-compact` specs if present.
 */
export function layoutEdges(root: HTMLElement): () => void {
  const svg = root.querySelector<SVGSVGElement>('svg[data-edges]');
  if (!svg) return () => {};
  const nodes = new Map<string, HTMLElement>();
  root.querySelectorAll<HTMLElement>('[data-node]').forEach((n) => nodes.set(n.dataset.node!, n));
  const paths = [...svg.querySelectorAll<SVGPathElement>('path[data-from][data-to]')];

  const run = () => {
    const origin = svg.getBoundingClientRect();
    if (origin.width === 0) return;
    const compact = getComputedStyle(root).getPropertyValue('--graph-compact').trim() === '1';
    svg.setAttribute('viewBox', `0 0 ${origin.width.toFixed(1)} ${origin.height.toFixed(1)}`);
    for (const p of paths) {
      const [fromId, fromSide] = parseEnd((compact && p.dataset.fromCompact) || p.dataset.from!);
      const [toId, toSide] = parseEnd((compact && p.dataset.toCompact) || p.dataset.to!);
      const from = nodes.get(fromId);
      const to = nodes.get(toId);
      // Hidden nodes (display:none at a breakpoint) drop their edges.
      if (!from || !to || !from.offsetParent || !to.offsetParent) {
        p.setAttribute('d', '');
        continue;
      }
      p.setAttribute('d', edgePath(portOf(from.getBoundingClientRect(), fromSide, origin), fromSide, portOf(to.getBoundingClientRect(), toSide, origin), toSide));
    }
  };

  let queued = 0;
  const schedule = () => {
    if (queued) return;
    queued = requestAnimationFrame(() => {
      queued = 0;
      run();
    });
  };
  new ResizeObserver(schedule).observe(root);
  // Web fonts change node sizes without resizing the root; re-measure once they settle.
  document.fonts?.ready.then(schedule);
  run();
  return schedule;
}

type AnimParams = Parameters<typeof animate>[1];

/**
 * Owns every animation, timer and pending await of one choreography run. `cancel()` stops them
 * all, resolves anything awaiting them (callers then see `alive === false` and bail), and runs
 * cleanups so the DOM is left in a sane state. A new run always gets a new scope.
 */
export class MotionScope {
  alive = true;
  #cleanups = new Set<() => void>();

  /** Register a cleanup for cancel; returns a function that unregisters it. */
  own(cleanup: () => void): () => void {
    this.#cleanups.add(cleanup);
    return () => this.#cleanups.delete(cleanup);
  }

  cancel(): void {
    if (!this.alive) return;
    this.alive = false;
    for (const c of this.#cleanups) c();
    this.#cleanups.clear();
  }

  wait(ms: number): Promise<void> {
    const { promise, resolve } = Promise.withResolvers<void>();
    if (!this.alive) {
      resolve();
      return promise;
    }
    const id = setTimeout(() => {
      release();
      resolve();
    }, ms);
    const release = this.own(() => {
      clearTimeout(id);
      resolve();
    });
    return promise;
  }

  animate(targets: Parameters<typeof animate>[0], params: AnimParams, onCancel?: () => void): Promise<void> {
    return this.animation(targets, params, onCancel).done;
  }

  /** Like `animate`, but also returns the live handle so callers can change `speed` mid-flight. */
  animation(targets: Parameters<typeof animate>[0], params: AnimParams, onCancel?: () => void): { done: Promise<void>; anim?: JSAnimation } {
    const { promise, resolve } = Promise.withResolvers<void>();
    if (!this.alive) {
      resolve();
      return { done: promise };
    }
    const anim = animate(targets, {
      ...params,
      onComplete: () => {
        release();
        resolve();
      },
    });
    const release = this.own(() => {
      anim.cancel();
      onCancel?.();
      resolve();
    });
    return { done: promise, anim };
  }
}

/**
 * Move a packet (an SVG circle) along a path once. The path length is read once per flight
 * (several packets run concurrently, so no per-frame length queries); layout only changes on
 * resize, and a packet lasts well under a second. Resolves at the sink port or on cancel.
 */
export function sendPacket(scope: MotionScope, path: SVGPathElement, dot: SVGCircleElement, duration = 900): Promise<void> {
  if (!path.getAttribute('d')) return Promise.resolve();
  const len = path.getTotalLength();
  const state = { t: 0 };
  const hide = () => dot.setAttribute('opacity', '0');
  return scope
    .animate(
      state,
      {
        t: [0, 1],
        duration,
        ease: 'linear',
        onUpdate: () => {
          const pt = path.getPointAtLength(state.t * len);
          dot.setAttribute('cx', pt.x.toFixed(1));
          dot.setAttribute('cy', pt.y.toFixed(1));
          // Fade in at the source port, out at the sink.
          dot.setAttribute('opacity', Math.min(1, state.t * 8, (1 - state.t) * 8).toFixed(2));
        },
      },
      hide,
    )
    .then(hide);
}

/**
 * Reveal an edge by animating its stroke from the source port. The stroke is hidden synchronously
 * so a delayed edge never paints fully drawn before its turn; cancelling shows it fully drawn.
 */
export function drawEdge(scope: MotionScope, path: SVGPathElement, duration = 500, delay = 0): Promise<void> {
  const len = path.getTotalLength();
  if (!len || !scope.alive) return Promise.resolve();
  const clear = () => {
    path.style.strokeDasharray = '';
    path.style.strokeDashoffset = '';
  };
  path.style.strokeDasharray = `${len}`;
  path.style.strokeDashoffset = `${len}`;
  return scope.animate(path, { strokeDashoffset: [len, 0], duration, delay, ease: 'outQuad' }, clear).then(clear);
}

/** Live reduced-motion preference. Every choreography subscribes to changes, not just reads it once. */
export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Report whether at least `threshold` of `el` is on screen. Used to start choreography only once
 * it is genuinely in view, and to pause loops when it leaves.
 */
export function watchVisibility(el: Element, onVisibility: (visible: boolean) => void, threshold = 0.25): void {
  new IntersectionObserver((entries) => entries.forEach((e) => onVisibility(e.isIntersecting && e.intersectionRatio >= threshold - 0.001)), {
    threshold: [0, threshold],
  }).observe(el);
}
