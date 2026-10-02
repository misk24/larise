# LARISÉ Error and Logging Conventions

## Error handling

Use typed application errors at domain/service boundaries.

- Validate external input with Zod before business logic.
- Return explicit success/error results from application services.
- Map expected errors to user-safe messages.
- Do not expose database errors, stack traces, tokens, or internal identifiers to public users.
- Use HTTP 401 for missing authentication, 403 for authorization failures, 404 for missing resources, 409 for conflicts, and 500 for unexpected server failures.

## Logging

Use the shared logger for server-side operational events.

Log:
- event name or concise message
- timestamp
- safe contextual identifiers when necessary
- error cause internally

Never log:
- passwords
- access/refresh tokens
- cookies
- Supabase service-role keys
- full authentication headers
- private guest contact data unless strictly necessary

Client-side UI errors should use actionable messages. Toasts are for user feedback, not a substitute for server-side diagnostics.

## Boundary rule

Routes, server actions, and domain services should translate low-level failures into application errors. Components should not contain database authorization logic.

## Phase 0 standard

A failure is considered handled when:
1. the user receives a safe, actionable message;
2. the server retains enough context to diagnose the failure;
3. secrets and sensitive data are absent from logs;
4. authorization failures do not reveal whether another user's resource exists.
