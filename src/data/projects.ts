/**
 * Project index for /work.
 *
 * Rules (see DESIGN.md → Voice):
 * - Summaries ≤ 20 words, zero em or en dashes.
 * - `outcome` holds numbers from Julienna's resume only. Unverified results stay
 *   out; the UI marks gaps with .ph-chip, never invented digits (CONTENT-TODO.md).
 * - `brief` describes the placeholder asset for <Slot> (mirrored in CONTENT-TODO.md).
 */

export const categories = ['Systems', 'Web', 'Brand', 'Motion', '3D', 'Automation', 'Direction'] as const;
export type Category = (typeof categories)[number];

export type Project = {
  slug: string;
  title: string;
  client: string;
  years: string;
  categories: Category[];
  /** One line, ≤ 20 words, verified facts only. */
  summary: string;
  /** Verified result, rendered as an outcome chip. Omit rather than invent. */
  outcome?: string;
  /** What asset belongs in this project's placeholder slot. */
  brief: string;
  /** First three flagships render as large rows on /work. */
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: 'orthoboost-brand-system',
    title: 'Persona brand and web system',
    client: 'OrthoBoost',
    years: '2025-present',
    categories: ['Systems', 'Web', 'Direction'],
    summary: 'Eleven personas that give each of ~40 orthodontic practices its own look and voice from one shared set of templates.',
    outcome: '~40 practices on one system',
    brief: 'OrthoBoost brand boards and site templates for three personas, side by side',
    featured: true,
  },
  {
    slug: 'wincore-product-viz',
    title: 'Wincore visualization at catalog scale',
    client: 'Machine Communications',
    years: '2022-2025',
    categories: ['3D', 'Systems'],
    summary: 'More than 5,000 architectural line drawings, plus a render template library covering 2,000+ window configurations.',
    outcome: '+25% online sales in two quarters',
    brief: 'Wincore window render beside its DWG line drawing source',
    featured: true,
  },
  {
    slug: 'geek-inc-conventions',
    title: 'A convention brand people wear',
    client: 'Geek Inc',
    years: '2019-2022',
    categories: ['Brand'],
    summary: 'One identity for three comic and toy conventions, from the badges to the billboards, seen by 30,000+ people a year.',
    outcome: '+27% pre-registration',
    brief: 'Geek Inc badge, bracelet, and signage set laid out on one table',
    featured: true,
  },
  {
    slug: 'orthoboost-ad-generator',
    title: 'React ad generator',
    client: 'OrthoBoost',
    years: '2025-present',
    categories: ['Systems', 'Automation'],
    summary: 'A rules-driven React app that turns one campaign brief into eight deliverables per practice, with no LLM in the render path.',
    outcome: '8 deliverables per practice per campaign',
    brief: 'Ad generator UI at the render step, output grid filling in',
  },
  {
    slug: 'orthoboost-photo-intake',
    title: 'Photo and asset intake pipeline',
    client: 'OrthoBoost',
    years: '2025-present',
    categories: ['Automation'],
    summary: 'Takes raw client shoots and turns them into organized, production-ready asset libraries.',
    brief: 'Raw shoot folder next to the organized production library it becomes',
  },
  {
    slug: 'machine-comms-collateral',
    title: 'AI-assisted catalog and collateral production',
    client: 'Machine Communications',
    years: '2022-2025',
    categories: ['Automation'],
    summary: 'AI tooling I introduced to cut catalog and brochure production time by 40%.',
    outcome: '40% less production time',
    brief: 'Catalog spread beside the template system that produced it',
  },
  {
    slug: 'gleam-visualizers',
    title: 'GLEAM visualizers',
    client: 'Freelance',
    years: '2017-present',
    categories: ['Motion', '3D'],
    summary: 'Low-poly 3D visualizers and Spotify Canvas loops for music releases, which I model, light, and loop myself.',
    brief: 'Three still frames from a GLEAM visualizer loop',
  },
  {
    slug: 'touchdesigner-live',
    title: 'TouchDesigner live visuals',
    client: 'Freelance',
    years: '2017-present',
    categories: ['Motion'],
    summary: 'Audio-reactive visuals I perform live in TouchDesigner, for rooms of up to 500 people.',
    brief: 'Live set photo with visuals running behind the artist',
  },
  {
    slug: 'decoy-ltd',
    title: 'DECOY Ltd visual direction',
    client: 'Freelance',
    years: '2017-present',
    categories: ['Brand', 'Direction'],
    summary: 'Visual direction and social for a streetwear label, from directing photographers to reels on three platforms.',
    brief: 'DECOY Ltd graphics on garment mockups',
  },
  {
    slug: 'music-event-posters',
    title: 'Music and event posters',
    client: 'Freelance',
    years: '2017-present',
    categories: ['Brand'],
    summary: 'Posters for grassroots and LGBTQ+-friendly shows, made with the people organizing them.',
    outcome: '+110% Instagram engagement, music client',
    brief: 'Poster wall of six gig posters from the series',
  },
  {
    slug: 'commissions',
    title: 'Commissions',
    client: 'Freelance',
    years: '2017-present',
    categories: ['Brand'],
    summary: 'Cover art and brand systems for musicians, including cover art for an artist with 10M+ Spotify plays.',
    brief: 'Grid of commissioned cover art',
  },
];
