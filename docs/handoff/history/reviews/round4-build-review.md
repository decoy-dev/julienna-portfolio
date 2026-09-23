```json
{
  "recommendation": "The round 4 design now answers the nine user requests. Hold delivery for three bounded accessibility/lifecycle fixes below; no further redesign is needed. Accept the reported spacing audit, performance, overflow, animation durations, and CTA-arrival measurements.",
  "blocking": [
    {
      "file": "src/sections/ClosingCta.astro:96\u2013115,125",
      "finding": "The arrival observer intentionally extends 20 viewport heights above the screen, but its callback has no actual-viewport check. Scrolling or jumping from below center to past the CTA can start the ring entirely offscreen. Leaving the screen during the 600ms pulse also does not cancel it. The comment promising an on-screen-only pulse is stronger than the implementation.",
      "fix": "Keep this extended observer for docking state, but separately track actual button visibility. Start the pulse only when the button is visible, and cancel it when the button leaves the real viewport. Preserve the existing hidden-tab and reduced-motion cancellation.",
      "check": "Jump from above the CTA to the footer, then cross the center normally and immediately scroll past it. Docking should remain correct; no offscreen pulse should start or continue."
    },
    {
      "file": "src/sections/PhotoIntake.astro:320\u2013322,327\u2013343",
      "finding": "The .cluster and .nm-row wrappers animate from opacity:.25, which also fades their readable folder names and filenames. Those labels become very low contrast during the run. An aria-hidden graphic still needs readable visual text; the static screen-reader description does not solve this.",
      "fix": "Keep .cl-label and .nm-file at full text contrast throughout. Apply opacity changes to decorative thumbnails/checkmarks only; use transform, border, or background changes to communicate progression.",
      "check": "Inspect the ready state and mid-run Sort/Name stages at 390 and 1440. Folder and filename text must remain readable before its stage activates."
    },
    {
      "file": "src/scripts/copy-email.ts:47; src/styles/global.css:192\u2013208; src/components/Footer.astro:56\u201365",
      "finding": "Clipboard failure replaces a compact button label with 'Copy failed, select the address instead', while .btn enforces white-space:nowrap and horizontal padding. That failure state can exceed the narrow footer column even though the normal state passed the overflow checks. [INFERENCE: visual overflow predicted from the source; not runtime-observed.]",
      "fix": "Keep the button label short, such as 'Copy failed', and put 'Select the email address instead.' in a wrapping status message associated with that button. Maintain one announcement source per action.",
      "check": "Deny Clipboard API access and force the fallback to return false. Check both /contact copy controls and the footer at 320/390, including keyboard focus and one error announcement."
    }
  ],
  "non_blocking": [
    {
      "file": "src/sections/AdGenerator.astro:263\u2013268,768\u2013820; src/scripts/ad-generator.ts:49\u201355",
      "finding": "Content curation now reads through visible alternatives, selected checks, and corresponding preview-zone activation. However, 'candidates landing in a Split Stack preview' overstates the actual effect: the chosen text is not transferred, and the preview contains empty bars that fade/shift into place.",
      "recommendation": "Accept this as a schematic demonstration, or make the selected headline/CTA visibly populate a sufficiently large preview in a later refinement. Do not describe it as literal content transfer in documentation."
    },
    {
      "file": "src/scripts/ad-generator.ts:129\u2013145; src/sections/AdGenerator.astro:21\u201324",
      "finding": "Replay rotates through all personas, but the two alternate deck cards remain Dr. K. Clarkson and Dr. G. House. When either becomes the chosen persona, the stack shows the same persona twice.",
      "recommendation": "Derive the two alternatives from the current selection, excluding that persona. The initial demonstration remains clear; this is a later-replay polish issue."
    },
    {
      "file": "src/sections/PhotoIntake.astro:62\u201366",
      "finding": "'The library is organized by where each file ends up: web, ads, social, and print' follows an illustrative disclaimer, but independently reads as a factual statement about the real library.",
      "recommendation": "Change to 'This example library groups files for web, ads, social, and print.' The surrounding disclosures and CONTENT-TODO.md are otherwise honest and specific."
    },
    {
      "file": "src/scripts/copy-email.ts:19\u201330",
      "finding": "The fallback selects a temporary textarea and removes it without explicitly restoring the invoking control's focus. Keyboard focus behavior can vary when that focused element disappears.",
      "recommendation": "Preserve and restore the previously focused element around the fallback, without moving focus for the successful Clipboard API path."
    }
  ],
  "confirmed": [
    "Ad selection: exposed alternative names, deck rotation, final check/ring, template scanning that settles on Split Stack, and visible content candidates substantially meet 'selected out of a stack' and 'curated from a selection'.",
    "Photo sequence: explicit Raw \u2192 Select \u2192 Sort \u2192 Name \u2192 Production library ordering, a Discarded tray, persistent keeper glyphs, and rectangular packets answer the requested process rather than merely renaming the old flow.",
    "Separate sections, local supporting copy, removed results row, locally folded honesty disclosures, centered visual signoff, CTA handoff, and footer replacement are present.",
    "Shared runner uses immediate settling through data-instant, retains finished content until play begins, and supports rectangular packets. Signoff cancellation resets the stamp transform. Main's measured 4.42s/4.45s end-to-end durations satisfy the stated finite-autoplay budget.",
    "Wire exterior/interior fills are clamped separately, the in-panel interval maps 55% to 50%, and the ball retains pointer-events:none on its independent layer. The guarded timeline attachment lifecycle remains intact.",
    "The shared clipboard initializer scopes controls and prevents duplicate wiring. Footer availability, response time, and time zone remain clearly marked placeholders.",
    "No new margin/padding/gap violation identified in the reviewed sections. Accepted Main's site-wide runtime spacing audit; icon sizes, thumbnail dimensions, and animation translations are not margin/padding/gap violations."
  ],
  "verification": "Read-only source review. Accepted Main's reported build, Lighthouse, spacing, overflow, timing, settling, edge-clearance, and ball-arrival evidence without rerunning it. The three targeted checks above concern states not established by those reported results."
}
```
