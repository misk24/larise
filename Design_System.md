# LARISÉ Design System

> Status: design direction and implementation rules. This document is not a claim that every token below already exists in CSS. Inspect `app/`, `styles/`, and current components before introducing or renaming tokens.

## 1. Brand direction

**Keywords:** minimal editorial, modern luxe, intimate, calm, contemporary Indonesian wedding.

Aim for premium through restraint and detail, not through excessive gold, gradients, oversized copy, or decorative clutter. The interface should feel approachable and trustworthy rather than exclusive or overly grand.

## 2. Language and content

- Default interface and marketing copy: Bahasa Indonesia.
- English is acceptable for brand-aligned headlines, familiar technical/product terms, and short labels where it reads more naturally.
- Use concise, concrete copy. Avoid unsupported superlatives and claims.
- Use LARISÉ consistently in brand-facing text; use ASCII-safe identifiers in code and URLs.
- Explain validation errors in plain language and preserve user-entered data when possible.

## 3. Visual foundations

### Color
- Prefer a restrained neutral foundation with warm, editorial surfaces and a deliberate dark-ink text color.
- Use one controlled accent for brand emphasis and primary actions.
- Maintain readable contrast in both light and dark themes where the screen supports both.
- Use semantic tokens for background, foreground, card, muted, border, input, ring, primary, secondary, destructive, and status colors.
- Do not hardcode repeated hex values across components. Reuse existing CSS variables and Tailwind theme mappings; if they need changing, propose a cohesive token update.

**Important:** derive exact color values from the current global styles and existing brand decisions. Do not invent a second competing palette in this document.

### Typography
- Use clear typographic hierarchy: display/headline, section heading, body, supporting text, and compact metadata.
- Editorial display typography may be expressive, but body text and form controls must prioritize legibility.
- Verify that selected fonts support Indonesian characters and the accented character in “LARISÉ”.
- Use fluid or responsive sizing where already consistent with the project.
- Avoid long centered paragraphs and excessively small mobile text.

### Layout and spacing
- Design mobile first, then enhance for tablet and desktop.
- Use a consistent spacing scale and shared container widths.
- Use whitespace to separate sections; avoid putting every section inside a card.
- Use grids that collapse cleanly and preserve content order on small screens.
- Prevent overflow from long names, URLs, guest names, and translated labels.

### Borders, surfaces, and depth
- Prefer subtle borders and restrained shadows.
- Use rounded corners consistently with existing components rather than arbitrary values per page.
- Reserve stronger surfaces for meaningful grouping, dialogs, and interactive controls.

## 4. Components and implementation

- Reuse existing shadcn/ui and project components before creating new primitives.
- Keep shared primitives in the established component locations; inspect the actual folder structure before adding files.
- Use variants for repeated component styles rather than duplicating class strings.
- Use semantic HTML and accessible labels for form controls.
- Interactive elements must have hover, focus-visible, disabled, loading, and error states where applicable.
- Buttons must communicate action and distinguish primary from secondary actions.
- Use icons consistently; decorative icons should not replace accessible text labels.

## 5. Motion

- Motion is purposeful, brief, and subordinate to content.
- Use the animation system already present in the affected area. The repository includes GSAP and Framer Motion dependencies; do not combine them in the same component by default.
- For landing-page scroll reveals, use the established project hook/pattern if one exists and verify its replay/cleanup behavior before modifying it.
- Avoid animating every element. Stagger related items only when it improves hierarchy.
- Respect `prefers-reduced-motion`; essential information must not depend on animation.
- Ensure animations clean up on unmount and do not cause layout shift or prevent interaction.

## 6. Responsive acceptance checklist

- [ ] No horizontal page overflow at narrow mobile widths.
- [ ] Primary action remains visible and easy to tap.
- [ ] Navigation opens, closes, and is keyboard accessible.
- [ ] Dialogs, dropdowns, and forms fit within the viewport.
- [ ] Long names and Indonesian copy wrap without breaking layout.
- [ ] Touch targets are comfortably usable.
- [ ] Reduced-motion preference is respected.
- [ ] Light/dark styling remains readable wherever both themes are supported.

## 7. Change process

Before adding a new design token or component:
1. Search for an existing equivalent.
2. Check global CSS/theme configuration and component variants.
3. Reuse existing conventions when possible.
4. If a new token is necessary, document its semantic purpose and update all relevant theme mappings.
5. Verify representative mobile and desktop states.
