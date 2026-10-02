# LARISÉ Domain Boundaries

Phase 0 establishes the following module boundaries:

- `app/`: Next.js routes, pages, layouts, and route handlers. Keep orchestration thin.
- `components/`: shared UI and presentation components. Domain-specific components should live near their feature when practical.
- `lib/supabase/`: Supabase browser/server infrastructure and auth session handling. Do not put business rules here.
- `lib/env.ts`: validated runtime environment access.
- `lib/result.ts`: application result/error primitives.
- `lib/logger.ts`: structured logging boundary.
- `features/<domain>/`: domain-specific application logic, schemas, services, and components as the product grows.
- `tests/`: unit/integration tests.
- `e2e/`: browser-level tests.

Initial product domains:

1. `auth`
2. `invitations`
3. `themes`
4. `guests`
5. `rsvps`
6. `wishes`
7. `media`
8. `payments` (reserved for future implementation)

Rules:

- UI components should not query Supabase directly.
- Business logic should not depend on React components.
- Server-only secrets stay outside client modules.
- Zod schemas belong at input boundaries.
- Prefer explicit Result/error handling in application services.
