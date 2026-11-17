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

- **Marketing/frontend and authentication surfaces:** Rosehot for display/headline use and Satoshi for body text, loaded with `next/font/local` in `app/fonts.ts`.
- **Dashboard and admin/backend:** Geist Sans for interface text and headings; Geist Mono for code and other monospaced content.
- **Published invitations:** typography is controlled by the selected invitation theme, not forced to inherit the marketing or dashboard font stack.

Use the established CSS scopes in `styles/frontend.css` and `styles/backend.css`. Backend color tokens live in `styles/backend-theme.css`. Avoid adding font classes outside the correct scope; audit shared components and nested layouts when changing typography.

## Components and boundaries

- **Frontend:** use original LARISÉ reusable components that match the brand system. Do not introduce shadcn/ui components into brand-facing frontend/landing-page UI.
- **Backend:** shadcn/ui is the standard component foundation for dashboard and admin application UI.
- Frontend building blocks live in `components/landing/ui`: `Container`, `Button` (`landingButtonStyles`), `Accordion`, `BrandLogo`, `ThemeToggle`, `AuthHeading`, `Field` and `PasswordField`, `OAuthButton`. Landing navigation data is in `config/landing-navigation.ts`; `config/navigation.ts` belongs to the backend.
- Each landing section has its own layout. Do not bring back shared section scaffolding (the old `Eyebrow`, `SectionHeader`, and `NumberedColumns` were removed because they made sections look identical).
- Auth pages (`app/(auth)`) use the `.frontend-shell` grid: form column plus a `hero.jpg` panel from `lg` up. Fields show inline errors with `noValidate`, and focus moves to the first invalid field.
- Prefer existing project components and variants within the appropriate boundary. Avoid duplicated one-off primitives.
- Keep component APIs focused and reusable without turning every small visual element into an abstraction.
- Use semantic HTML, associated form labels, visible keyboard focus, accessible names for icon-only controls, and appropriate disabled/loading/error states.

## Color, surfaces, and layout

- **Backend palette:** neutral light surfaces with burgundy actions. Light mode uses `#F8F8F7` background, `#FFFFFF` cards, `#252525` foreground, and `#7A3448` primary. Muted burgundy (`#F0E5E8`) marks secondary and active surfaces.
- Backend palette variables are scoped to `.backend-shell` in `styles/backend-theme.css`; they must not alter marketing/frontend or published invitation theme colors.
- Reuse semantic CSS variables and Tailwind mappings rather than scattering hardcoded colors.
- Preserve readability in supported light/dark themes.

### Landing and auth palette

Tokens live in `styles/frontend.css`, scoped to `.frontend-shell`, and map to Tailwind through `@theme inline` (`bg-paper`, `text-fg`, and so on). Do not use raw hex values in landing or auth components.

| Token | Use | Dark mode |
| --- | --- | --- |
| `paper`, `paper-deep` | Page and alternate section backgrounds | Flips |
| `surface` | Card and input surfaces | Flips |
| `fg` | Text and strokes on page surfaces | Flips |
| `danger` | Form errors | Flips |
| `ink`, `ink-soft`, `ink-hover` | Dark sections (value, CTA, footer) | `ink` darkens, stays a dark section |
| `ivory` | Text on `ink` | Fixed light |
| `gold-deep` | Accent text on light surfaces | Lightens |
| `gold-soft` | Accent text on `ink` | Fixed |
| `gold` | Decoration only (3:1 on paper, too low for small text) | Fixed |

Check WCAG contrast for every new pairing: 4.5:1 for text, 3:1 for input borders and other UI strokes.

### Theme (light, dark, system)

- `next-themes` runs with `attribute="data-theme"`, `defaultTheme="system"` and `storageKey="larise-theme"`. It does not use the `.dark` class, so dark mode applies only to `html[data-theme="dark"] .frontend-shell`. The dashboard, admin, and published invitations never read it.
- `ThemeToggle` (`components/landing/ui/theme-toggle.tsx`) is the only switch. It sits in the navbar and the mobile menu.
- Sections that are dark in both themes use `ink` with `ivory` text. Do not use `fg` or `paper` inside them.
- Use consistent spacing, container widths, radii, and subtle borders. Not every section needs a card.
- Design mobile first. Long names, URLs, and Indonesian text must wrap without causing page-wide horizontal overflow.
- Keep interactive targets comfortable to tap and maintain a clear primary action.

## Motion and accessibility

- Motion should support hierarchy and feedback, not delay access to content.
- Framer Motion is the only animation library (GSAP and `motion` were removed). `MotionProvider` wraps the app with `reducedMotion="user"`.
- On the landing, animate only the hero and the collection. Other sections stay static so one moment carries the page.
- Respect `prefers-reduced-motion`, clean up animations, and avoid motion that blocks interaction.
- Check keyboard behavior, focus visibility, mobile layout, and loading/empty/error/success states for changed flows.

## Backend page patterns

- Page order: `BackendPageHeader`, optional key figures, then content. Breadcrumbs live in the header bar next to the sidebar toggle (hidden on phones, where the page title does the job).
- Key figures use one connected `BackendStatGrid` of `BackendStatCard` cells, always four items. Do not render stat cards as separate bordered cards.
- Data tables sit directly under the page header. Do not wrap a table in a Card that repeats the page title or the row count; the table footer already shows it.
- Use a Card when a block has its own title and purpose (a form section, a recent-activity list). Give its `CardTitle` `role="heading" aria-level={2}` and `text-base`; use `CardAction` for the "see all" link.
- Radius: containers (cards, tables, empty and error states) use `rounded-xl`; inner blocks `rounded-lg`; controls `rounded-md`.
- Surfaces are flat in the backend (`.backend-shell [data-slot="card"]` removes the shadow). Shadow is for floating layers only.
- Placeholder pages and "nothing here yet" blocks use `BackendEmptyState`; failed loads use `BackendErrorState` (or `AdminTableError` for tables). Status chips use `BackendStatusBadge` tones.
- Group labels and table headers use sentence case, not all caps.
- Page content stacks with `space-y-8`. The builder is the one exception: it stays denser (`space-y-6`) because the editor needs the room.
- Pages that act on one invitation at a time (guests, RSVP, wishes, gallery) use `BackendInvitationPicker` when the user has two or more invitations. Do not build per-page selectors.
- Admin data tables use `Table className="admin-stack"`: below `sm` each row becomes a stacked card with labels taken from the column header string. Columns need a string `header` to get a label.
- A row with more than three actions keeps the primary one and the toggle visible and moves the rest into a "Lainnya" menu, with the destructive item last. `ConfirmDialog` takes `open` and `onOpenChange` for use from a menu.
- Do not hardcode palette colors (`bg-amber-100` and the like) in backend components; use tokens. Dates in tables use `{ dateStyle: "medium" }`.

## Change checklist

1. Confirm whether the component belongs to frontend or backend.
2. Search for an existing equivalent and inspect its tokens and variants.
3. Keep font and component usage within the correct scope.
4. Verify responsive and accessible states.
5. Update this document when the approved conventions change; do not silently reinterpret product decisions.
