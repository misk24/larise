# LARISÉ Product Requirements Document

> Status: working baseline. Update this document when product scope changes. Implemented behavior must be verified against the codebase before being described as complete.

## 1. Product summary

LARISÉ is an Indonesian digital wedding invitation platform. Couples can create and share a personalized invitation website using reusable themes, then manage guest responses and messages from a dashboard.

**Product promise:** make it easier to publish a polished, personal wedding invitation without building a website from scratch.

## 2. Target users

- Couples or families preparing a wedding who need a shareable online invitation.
- Invitation owners who need to personalize event information and distribute invitations to guests.
- Administrators who manage themes and platform content.

Primary market and default product language: Indonesia / Bahasa Indonesia. English may be used where it is natural for product branding or common UI terminology.

## 3. Product principles

1. **Mobile first:** guest-facing invitations and the dashboard must work well on common mobile screens.
2. **Personal, not generic:** support names, event details, photos, stories, and other invitation content.
3. **Editorial and modern luxe:** restrained typography, whitespace, clear hierarchy, and intentional motion; avoid visual clutter.
4. **Reliable sharing:** public invitation pages must load without requiring guests to create an account.
5. **Secure by default:** private dashboard data and administrative actions must be authorized on the server/database, not only hidden in the UI.
6. **Honest UX:** never show fabricated statistics, testimonials, availability, or success states.

## 4. Core user journeys

### Invitation owner
1. Register or sign in using supported authentication methods.
2. Complete or review their profile.
3. Create an invitation and select an available theme.
4. Edit supported invitation sections and event details.
5. Preview the invitation and publish/share its public URL.
6. Review guest responses and messages, and manage invitation settings.

### Guest
1. Open a shared public invitation link on mobile or desktop.
2. Read event information and use available location/media features.
3. Submit an RSVP and/or a message where enabled.
4. Receive clear validation and submission feedback.

### Administrator
1. Sign in with an authorized administrator account.
2. Access the admin area without gaining access merely by changing a URL.
3. Manage themes and their section definitions/content.
4. See clear validation and error states when saving changes.

These journeys describe product intent, not a claim that every step is already implemented. Verify routes and feature status in code before changing them.

## 5. Feature areas

- Authentication and user profiles.
- Invitation creation, editing, preview, publication, and sharing.
- Theme catalog and theme-specific sections.
- Guest list and RSVP management.
- Guest wishes/messages.
- Invitation media such as gallery and optional audio/video where implemented.
- Event details, maps, countdowns, dress code, love story, gift information, and other configurable sections where supported.
- Admin tools for theme/content management.

Do not treat every item in this list as an existing or release-ready feature. Check implementation, schema, and tests first.

## 6. Non-functional requirements

- Responsive layouts, keyboard accessibility, visible focus states, and semantic HTML.
- Respect reduced-motion preferences and avoid motion that blocks essential content.
- Protect private data with Supabase Row Level Security (RLS) and server-side authorization.
- Keep secrets out of source control and client bundles.
- Validate untrusted form input on the server and provide useful errors.
- Preserve existing user data and backward compatibility when changing schemas.
- Maintain reasonable performance on mobile and avoid unnecessary client-side JavaScript.
- Add or update automated tests for behavior changed.

## 7. Product design acceptance criteria

- Mobile layouts are usable without horizontal overflow at narrow widths.
- Page hierarchy and primary action are immediately understandable.
- Loading, empty, error, and success states are designed where relevant.
- UI uses established project tokens/components instead of introducing one-off styles without reason.
- Animation supports hierarchy and does not prevent interaction or content access.

## 8. Definition of done

A change is complete when:
- Acceptance criteria are met.
- Authorization and validation are correct for the affected flow.
- Relevant tests pass, and lint/typecheck/build are run when feasible.
- Documentation is updated if behavior, architecture, or conventions changed.
- No unrelated files or secrets are included.
- Remaining limitations and checks not run are reported honestly.

## 9. Scope control

For each task, state what is in scope and out of scope before implementation. Do not expand a task into a redesign or refactor unless required and explicitly documented. When requirements are ambiguous and the ambiguity affects data safety, security, or architecture, stop and ask for clarification; otherwise state a conservative assumption in the plan.
