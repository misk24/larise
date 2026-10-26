# LARISÉ Design System

> Status: design conventions confirmed against the current repository and explicit product decisions. This describes the intended system; individual screens still require implementation review.

## Brand direction

LARISÉ uses a minimal editorial + modern luxe direction: intimate, calm, contemporary, and restrained. Premium presentation should come from typography, whitespace, hierarchy, and considered details rather than decorative clutter.

## Language and content

- Default UI and marketing language is Bahasa Indonesia; English is acceptable for brand headlines and established product terminology.
- Use the LARISÉ brand spelling in user-facing copy and ASCII-safe identifiers in code and URLs.
- Prefer concise, concrete copy. Do not invent testimonials, metrics, or unsupported product claims.
- Keep validation and error messages understandable and preserve entered data where possible.

## Typography

The repository intentionally separates brand-facing and application UI typography:

- **Marketing/frontend and editorial authentication surfaces:** Rosehot for display/headline use and Satoshi for body text.
- **Dashboard and admin/backend:** Geist Sans for interface text and headings; Geist Mono for code and other monospaced content.
- **Published invitations:** typography is controlled by the selected invitation theme, not forced to inherit the marketing or dashboard font stack.

Use the established CSS scopes in `styles/frontend.css` and `styles/backend.css`. Avoid adding font classes outside the correct scope; audit shared components and nested layouts when changing typography.

## Components and boundaries

- **Frontend:** use original LARISÉ reusable components that match the brand system. Do not introduce shadcn/ui components into brand-facing frontend/landing-page UI.
- **Backend:** shadcn/ui is the standard component foundation for dashboard and admin application UI.
- Prefer existing project components and variants within the appropriate boundary. Avoid duplicated one-off primitives.
- Keep component APIs focused and reusable without turning every small visual element into an abstraction.
- Use semantic HTML, associated form labels, visible keyboard focus, accessible names for icon-only controls, and appropriate disabled/loading/error states.

## Color, surfaces, and layout

- Reuse existing semantic CSS variables and Tailwind mappings rather than scattering hardcoded colors.
- Preserve readability in supported light/dark themes.
- Use consistent spacing, container widths, radii, and subtle borders. Not every section needs a card.
- Design mobile first. Long names, URLs, and Indonesian text must wrap without causing page-wide horizontal overflow.
- Keep interactive targets comfortable to tap and maintain a clear primary action.

## Motion and accessibility

- Motion should support hierarchy and feedback, not delay access to content.
- Use the existing motion approach in the affected area; dependencies include Framer Motion and GSAP, but do not mix them in a component without a concrete reason.
- Respect `prefers-reduced-motion`, clean up animations, and avoid motion that blocks interaction.
- Check keyboard behavior, focus visibility, mobile layout, and loading/empty/error/success states for changed flows.

## Change checklist

1. Confirm whether the component belongs to frontend or backend.
2. Search for an existing equivalent and inspect its tokens and variants.
3. Keep font and component usage within the correct scope.
4. Verify responsive and accessible states.
5. Update this document when the approved conventions change; do not silently reinterpret product decisions.
