# LARISÉ Product Requirements Document

> Status: product intent and verified implementation status are recorded separately. A documented gap is not permission to weaken or remove an approved requirement.

## 1. Product summary

LARISÉ is an Indonesian digital wedding invitation platform. Couples create and share a personalized invitation website using reusable themes, then manage invitation content and guest responses through a dashboard.

**Product promise:** make it easier to publish a polished, personal wedding invitation without building a website from scratch.

## 2. Target users and language

- Couples or families preparing a wedding who need a shareable online invitation.
- Invitation owners who personalize event information and distribute invitations.
- Administrators who manage themes and platform content.

The primary market and default product language are Indonesia and Bahasa Indonesia. English is acceptable where natural for branding and familiar product terminology.

## 3. Product principles

1. **Mobile first:** guest-facing invitations and dashboard workflows must work on common mobile screens.
2. **Personal, not generic:** support names, event details, photos, and other invitation content.
3. **Editorial and modern luxe:** restrained typography, whitespace, clear hierarchy, and intentional motion.
4. **Reliable sharing:** public invitation pages should not require guests to create an account.
5. **Secure by default:** private data and administrative actions must be protected by server-side authorization and database policies.
6. **Honest UX:** never fabricate statistics, testimonials, availability, or success states.

## 4. Core user journeys

### Invitation owner
1. Register or sign in using supported authentication methods.
2. Complete or review their profile.
3. Create an invitation and select an available theme.
4. Edit invitation sections and event details.
5. Preview and publish/share the public URL.
6. Review guest responses and wishes, and manage invitation settings.

### Guest
1. Open a shared public invitation on mobile or desktop.
2. Read event information and use available location/media features.
3. Submit an RSVP and/or message where enabled.
4. Receive clear validation and submission feedback.

### Administrator
1. Sign in using an authorized administrator account.
2. Access the admin area without gaining access merely by changing a URL.
3. Manage themes and section definitions/content.
4. Receive clear validation and error states when saving changes.

These journeys express product intent. Their implementation status is documented separately below and must be verified against source, migrations, and tests.

## 5. Functional requirements and implementation status

### Authentication and account
- Support email/password and Google authentication.
- Support email verification and role-aware protected areas.
- Allow users to update profile information.
- Allow password changes for email/password accounts after re-authentication; Google-provider accounts must use Google for password management.
- Show account deletion information in the Danger Zone, but do not claim deletion works until the deletion flow and data-retention behavior are implemented and verified.

**Verified source status:** profile management, Login & Security, provider-specific password restrictions, and Danger Zone UI are present on `main`. Account deletion is intentionally not implemented.

### Invitation creation and editing
- Create an invitation through a two-step flow: basic couple information, then theme selection.
- Generate a unique slug from nicknames in the chosen name order.
- Lock slug and name order after draft creation.
- Keep event date out of create/edit forms; manage it through the builder.
- Let owners edit allowed invitation content and select an active theme.

**Verified source status:** PR #47 is merged into `main`; the create/edit UI and server action follow the two-step flow. The edit UI treats slug, nickname, and name order as locked. The builder's Event section edits the event date, and its save action synchronizes that value to `invitations.event_date`.

### Invitation builder and published content
- Let owners edit section content, visibility, and order; preview before publishing.
- Keep the Cover and Opening at the beginning and Closing at the end.
- Provide event details, location, gallery, RSVP/wishes, gift details, closing content, and optional background music from an owner-supplied HTTPS audio URL.
- Keep countdown as a planned feature, deferred from the current implementation scope until a later phase.
- Save changes with clear feedback and avoid claiming publication until it succeeds.

**Verified source status:** PR #48 is merged into `main`. The current builder list in `components/dashboard/invitation-builder.tsx` filters editable sections to ten types: Cover, Opening, Quote, Couple, Event, Location, Gallery, RSVP, Gift, and Closing. RSVP and wishes are combined in the guest-facing flow. The validation schema still recognizes a `countdown` section type, but the builder's current filter excludes it. Countdown is intentionally deferred to a later phase by product decision. It is not a current acceptance criterion for this phase, and it must not be described as implemented. Revisit it when the later phase is planned. Background music is stored on the invitation record (not as a reorderable section), can be cleared by removing the URL, and uses an explicit player control rather than relying on browser-blocked autoplay.

### Guests and content
- Support guest response management and wishes/messages where enabled.
- Support invitation media and configurable sections only where implemented and validated.
- Protect invitation ownership and guest data at server/database layers.

### Themes and administration
- Allow administrators to manage reusable themes and section defaults/content.
- Keep theme definitions distinct from invitation-specific content where the schema supports it.
- Verify migration status and admin authorization before describing a change as deployed.

## 6. Non-functional requirements

- Responsive layouts, semantic HTML, keyboard accessibility, and visible focus states.
- Respect reduced-motion preferences; essential content must not depend on animation.
- Protect private data with RLS and server-side authorization.
- Keep secrets out of source control and client bundles.
- Validate untrusted form input on the server and provide useful errors.
- Preserve existing user data and backward compatibility when changing schemas.
- Maintain reasonable mobile performance and avoid unnecessary client-side JavaScript.
- Add or update automated tests for changed behavior.

## 7. Design acceptance criteria

- Mobile layouts work without horizontal page overflow at narrow widths.
- Page hierarchy and primary action are clear.
- Relevant loading, empty, error, disabled, and success states are implemented.
- Components follow the approved frontend/backend boundaries in `Design_System.md`.
- Animation supports hierarchy and does not prevent interaction or content access.

## 8. Definition of done

A change is complete when:
- Approved acceptance criteria are met.
- Authorization and validation are correct for the affected flow.
- Relevant tests pass; lint, typecheck, and build are run when feasible.
- Documentation is updated for verified behavior, architecture, or approved conventions.
- No unrelated files or secrets are included.
- Remaining limitations and checks not run are reported honestly.

## 9. Scope and discrepancy handling

When a product requirement and implementation disagree:
1. Verify the actual behavior in the target branch, related actions, schema, migrations, and tests.
2. Record the requirement and observed behavior separately.
3. Do not silently rewrite the PRD to match existing code.
4. Ask the product owner whether to implement the requirement, change it, or explicitly defer it.
5. Update the requirement only after approval.

Do not treat a schema type, UI label, PR description, or merged PR as proof that a feature is fully usable or deployed.
