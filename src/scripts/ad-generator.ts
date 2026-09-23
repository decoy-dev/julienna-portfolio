/**
 * Ad generator choreography (src/sections/AdGenerator.astro). Four decision gates run left to
 * right: the persona and brand-kit decks riffle to their choice, a highlight scans the template
 * library and settles on Split Stack, one candidate per content slot lands in the assembled
 * preview, then Render fans out into the 8-file matrix. Built on the shared lane runner; deck
 * order, content picks and preview fills are custom state restored in onReset/onFinish.
 * Replay advances the persona: the chosen card's text and the output's `--persona` tint.
 */
import { createLaneRunner, type LaneRunner, type Run } from './pipeline';

type Persona = { name: string; archetype: string; color: string };

/** One riffle: the front card (slot 2) slides to the back, the cards behind advance. */
const ROTATE: Record<string, string> = { '2': '0', '1': '2', '0': '1' };

export function createAdGenerator(lane: HTMLElement): LaneRunner {
  const $ = (sel: string) => lane.querySelector<HTMLElement>(sel);
  const $$ = (sel: string) => [...lane.querySelectorAll<HTMLElement>(sel)];

  const decks = $$('[data-deck]'); // persona, kit (DOM order)
  const deckCards = decks.map((d) => [...d.querySelectorAll<HTMLElement>('[data-card]')]);
  const templates = $('[data-templates]');
  const scans = $$('[data-tpl]').slice(0, 3); // the highlight walks these, then lands on Split Stack
  const content = $('[data-content]');
  const slots = $$('[data-slot-pick]');
  const zones = $$('[data-zone]');
  const render = $('[data-render]');
  const output = $('[data-output]');
  const nameEl = $('[data-persona-name]');
  const typeEl = $('[data-persona-type]');
  const paths = [...lane.querySelectorAll<SVGPathElement>('path.edge')];

  /** The kit -> template hop has a twin path for the two-column layout; use the visible one. */
  const edge = (id: string): SVGPathElement | undefined => {
    const twins = paths.filter((p) => p.dataset.id === id);
    if (twins.length < 2) return twins[0];
    return twins.find((p) => getComputedStyle(p).display !== 'none') ?? twins[0];
  };

  const rotate = (cards: HTMLElement[]) => {
    for (const c of cards) c.dataset.slot = ROTATE[c.dataset.slot ?? '0'];
  };
  /** Everything the choreography touches outside the runner's stateful set, in one place. */
  const restore = (state: 'ready' | 'done') => {
    const done = state === 'done';
    for (const cards of deckCards) for (const c of cards) c.dataset.slot = c.dataset[state];
    for (const s of slots) (done ? (s.dataset.pick = '') : delete s.dataset.pick);
    for (const z of zones) (done ? (z.dataset.fill = '') : delete z.dataset.fill);
    for (const s of scans) delete s.dataset.scan;
  };
  /** The chosen candidate gets its check; the matching preview zone fills. */
  const pick = (slot: HTMLElement) => {
    slot.dataset.pick = '';
    const zone = zones.find((z) => z.dataset.zone === slot.dataset.slotPick);
    if (zone) zone.dataset.fill = '';
  };

  const choreography = async ({ scope, step, travel, reveal }: Run) => {
    const [personaDeck, kitDeck] = decks;
    const [personaCards, kitCards] = deckCards;
    const beat = async (ms: number) => {
      await scope.wait(ms);
      return scope.alive;
    };

    // Persona: riffle twice; the chosen card lands in front and takes the ring + check.
    if (personaDeck) personaDeck.dataset.state = 'active';
    rotate(personaCards);
    if (!(await beat(190))) return false;
    rotate(personaCards);
    if (!(await beat(210))) return false;
    if (personaDeck) personaDeck.dataset.state = 'done';
    if (!(await beat(160))) return false;
    void travel(edge('e1'), 250);

    // The kit riffles while the packet is still flying: the next gate opening.
    if (!(await beat(140))) return false;
    if (kitDeck) kitDeck.dataset.state = 'active';
    rotate(kitCards);
    if (!(await beat(190))) return false;
    rotate(kitCards);
    if (!(await beat(210))) return false;
    if (kitDeck) kitDeck.dataset.state = 'done';
    if (!(await beat(120))) return false;
    void travel(edge('e2'), 250);

    // Template: the highlight walks the library, left to right, and settles on Split Stack.
    if (!(await beat(180))) return false;
    if (templates) templates.dataset.state = 'active';
    for (const s of scans) {
      s.dataset.scan = '';
      const alive = await beat(60);
      delete s.dataset.scan;
      if (!alive) return false;
    }
    if (templates) templates.dataset.state = 'done';
    if (!(await beat(320))) return false;
    void travel(edge('e3'), 250);

    // Content: one candidate per slot, each landing in the assembled preview.
    if (!(await beat(200))) return false;
    if (content) content.dataset.state = 'active';
    for (const slot of slots) {
      pick(slot);
      if (!(await beat(120))) return false;
    }
    if (content) content.dataset.state = 'done';
    if (!(await beat(160))) return false;
    void travel(edge('e4'), 300);

    // Render, then the matrix fills item by item while the ticker streams file names.
    if (!(await beat(240))) return false;
    await step(render, 350);
    void travel(edge('e5'), 250);
    if (!(await beat(230))) return false;
    return reveal(55);
  };

  const runner = createLaneRunner({
    lane,
    choreography,
    onReset: () => restore('ready'),
    onFinish: () => restore('done'),
  });

  // Each run renders the next persona (the first keeps the shipped Dr. V. Frizzle): the chosen
  // card's text changes and the output frames re-tint through `--persona` (client color, allowed
  // only inside rendered previews). From the second run on, the two alternate cards follow the
  // selection (the next two personas in site order, skipping the chosen one), so the stack never
  // shows the same persona twice; the shipped first run keeps Clarkson and House behind Frizzle.
  const personas: Persona[] = JSON.parse(lane.dataset.personas ?? '[]');
  const altNames = $$('[data-alt-name]');
  const altTypes = $$('[data-alt-type]');
  let run = -1;
  let ran = false;
  return {
    ...runner,
    play() {
      if (personas.length && nameEl && typeEl && output) {
        run = (run + 1) % personas.length;
        const p = personas[run];
        nameEl.textContent = p.name;
        typeEl.textContent = p.archetype;
        output.style.setProperty('--persona', p.color);
        if (ran) {
          altNames.forEach((el, k) => {
            const alt = personas[(run + 1 + k) % personas.length];
            el.textContent = alt.name;
            if (altTypes[k]) altTypes[k].textContent = alt.archetype;
          });
        }
        ran = true;
      }
      return runner.play();
    },
  };
}
