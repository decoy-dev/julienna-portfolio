/**
 * Single source of truth for site copy and facts.
 *
 * Rules (see DESIGN.md → Voice):
 * - Only numbers that appear on Julienna's resume ship unmarked.
 * - Anything unverified is `placeholder: true`; the UI renders it with the dashed
 *   "needs input" treatment and CONTENT-TODO.md lists it.
 * - Zero em or en dashes in any visible string.
 */

export const person = {
  name: 'Julienna Batten',
  role: 'Web Designer & Creative Director',
  email: 'julesbatten.design@gmail.com',
  linkedin: '', // TODO(Jules): profile URL; empty hides the link sitewide (CONTENT-TODO.md)
  resume: '/assets/Julienna-Batten-Resume.pdf', // TODO(Jules): replace with the current resume PDF
};

export type Stat = {
  value: string;
  label: string;
  source?: string;
  placeholder?: boolean;
};

/** Proof rail. Verified results lead; placeholders follow so the first read is real proof. */
export const stats: Stat[] = [
  { value: '~40', label: 'practices on one brand system', source: 'OrthoBoost' },
  { value: '+25%', label: 'online sales in two quarters', source: 'Wincore' },
  { value: '000', label: 'hours saved per year', placeholder: true },
  { value: '0,000', label: 'assets shipped since 2017', placeholder: true },
  { value: '$0.0M', label: 'revenue influenced', placeholder: true },
];

export type Brand = { name: string; placeholder?: boolean };

/** Logo slots. Real SVGs go in src/assets/logos/{slug}.svg (see CONTENT-TODO.md). */
export const brands: Brand[] = [
  { name: 'OrthoBoost' },
  { name: 'Wincore' },
  { name: 'Machine Communications' },
  { name: 'Geek Inc.' },
  { name: 'DECOY Ltd' },
  { name: 'Client logo', placeholder: true },
  { name: 'Client logo', placeholder: true },
];

/** The six seats of a creative team I cover. Drives the hero graph and the background "Now" node. */
export const seats = [
  { id: 'direction', label: 'Creative direction', short: 'Direction', icon: 'ph:compass' },
  { id: 'brand', label: 'Brand identity', short: 'Brand', icon: 'ph:pen-nib' },
  { id: 'web', label: 'Web design + code', short: 'Web + code', icon: 'ph:browsers' },
  { id: 'motion', label: 'Motion', short: 'Motion', icon: 'ph:film-strip' },
  { id: 'viz', label: '3D + visualization', short: '3D + viz', icon: 'ph:cube' },
  { id: 'systems', label: 'Automation', short: 'Automation', icon: 'ph:flow-arrow' },
] as const;

/**
 * The 11 real personas from the OrthoBoost ad generator repo (data/personas/*.json).
 * Accent colors belong to the personas: they may only appear inside rendered-output previews,
 * never as UI color (DESIGN.md → Color → Client color).
 */
export const personas = [
  { name: 'Dr. V. Frizzle', archetype: 'The Wellness Educator', color: '#48bb78' },
  { name: 'Dr. A. Joe', archetype: 'Budget-Friendly Everyday Ortho', color: '#3182ce' },
  { name: 'Dr. A. Sciuto', archetype: 'Modern Alternative Wellness', color: '#319795' },
  { name: 'Dr. B. Nye', archetype: 'Science-Driven Holistic Clinic', color: '#dd6b20' },
  { name: 'Dr. C. Yang', archetype: 'High-Expertise Clinical Ortho', color: '#d69e2e' },
  { name: 'Dr. D. Houser', archetype: 'Pediatric Dentistry & Orthodontics', color: '#f05252' },
  { name: 'Dr. G. House', archetype: 'Premium Family Ortho', color: '#2f855a' },
  { name: 'Dr. K. Clarkson', archetype: 'Adult Cosmetic-Focused Aesthetic Ortho', color: '#805ad5' },
  { name: 'Dr. M. Rogers', archetype: 'Family-Focused Community Ortho', color: '#38a169' },
  { name: 'Dr. McStuffins', archetype: 'Pediatric Wellness Practice', color: '#ed64a6' },
  { name: 'D. K. Kardashian', archetype: 'Luxury Wellness Practice', color: '#9f7aea' },
];

export const templates = ['Badge Burst', 'Hero Banner CTA', 'Offer Card', 'Split Stack', 'Testimonial Frame'];
