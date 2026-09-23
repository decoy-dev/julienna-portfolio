/**
 * Photo intake choreography (src/sections/PhotoIntake.astro). The five stages are CSS-owned:
 * flipping a zone's data-state runs its per-item staggers (transition-delay from --k/--c custom
 * props), so the runner only walks the stages in order and sends one thumbnail packet across each
 * gap. Nominal wall clock ≈ 4.3s including the last CSS transition (contract: under 5s).
 */
import { createLaneRunner, type LaneRunner } from './pipeline';

export function createPhotoIntake(lane: HTMLElement): LaneRunner {
  const zone = (id: string) => lane.querySelector<HTMLElement>(`[data-node="${id}"]`);
  const into = (id: string) => lane.querySelector<SVGPathElement>(`path.edge[data-to^="${id}:"]`);
  return createLaneRunner({
    lane,
    async choreography(run) {
      // Select: rejects take an X cue, then leave into the Discarded tray (7 x 60ms stagger).
      if (!(await run.step(zone('ph-raw'), 800))) return false;
      await run.travel(into('ph-select'), 250);
      // Keepers rise with ring + check badges (8 x 50ms, badges 90ms behind each).
      if (!(await run.step(zone('ph-select'), 640))) return false;
      await run.travel(into('ph-sort'), 250);
      // Four destination clusters, one per 110ms.
      if (!(await run.step(zone('ph-sort'), 540))) return false;
      await run.travel(into('ph-name'), 250);
      // Eight file cards in cluster order (8 x 55ms).
      if (!(await run.step(zone('ph-name'), 640))) return false;
      await run.travel(into('ph-lib'), 250);
      // Folder rows fill while the ticker streams one path per folder.
      return run.reveal(110);
    },
  });
}
