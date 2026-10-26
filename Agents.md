# LARISÉ AI Agent Instructions

These rules apply to AI coding agents and contributors using AI assistance.

## 1. Required reading

Before planning work, read:
1. `Agents.md`
2. `PRD.md` for product intent and acceptance criteria
3. `Design_System.md` for approved visual and component conventions
4. `Architecture.md` for routes, data, auth, infrastructure, and integration boundaries
5. Relevant source files, tests, migrations, and recent pull-request diffs

The repository is the source of truth for current implementation. The PRD is the source of truth for approved product intent. Neither should be silently rewritten to conceal a mismatch with the other.

## 2. Workflow: Plan → Implement → Verify → Review

### Plan
- Restate the requested outcome and observable acceptance criteria.
- Read actual implementation and relevant tests, not just filenames or PR summaries.
- Identify likely files, migration/auth/accessibility/responsive risks, and out-of-scope work.
- State assumptions explicitly.
- For non-trivial work, present a plan and wait for approval unless the user has already authorized implementation.

### Implement
- Make the smallest coherent change that meets the approved scope.
- Follow established folder, component, naming, and data-access conventions.
- Frontend/landing-page UI uses original reusable LARISÉ components; shadcn/ui is reserved for dashboard/admin backend UI.
- Reuse existing validators, tokens, components, and Supabase clients.
- Do not add dependencies or refactor unrelated code without a concrete reason.
- Preserve user data and backward compatibility.
- Never expose secrets or weaken authorization/RLS to make a feature work.
- Do not run destructive database commands or delete user data without explicit authorization.

### Verify
Run relevant checks and broaden coverage when feasible:
1. `npm run lint`
2. `npm run typecheck`
3. `npm test`
4. `npm run test:e2e` for affected user journeys
5. `npm run build`

Report the exact checks run and their observed outcomes. If a check is blocked by missing environment variables, external services, dependencies, or browser setup, state that; do not imply it passed.

For UI work, check mobile and desktop, keyboard/focus behavior, loading/empty/error/success states, and reduced-motion preferences where applicable. For auth/data work, review server authorization, RLS, migrations, and anonymous/user/admin access as relevant.

### Review
- Compare the final diff with the task and approved requirements.
- Check for accidental secrets, unrelated changes, broken imports, unsafe SQL/RLS, and missing tests.
- Update documentation when verified implementation or approved conventions change.
- Do not merge or deploy unless explicitly requested.
- Summarize files changed, decisions, test results, and unresolved risks honestly.

## 3. Handling PRD/implementation mismatches

When source code and product requirements differ:
1. Confirm the behavior in the current target branch and relevant tests/migrations.
2. Describe the exact requirement and observed implementation, with file/route references.
3. Do not alter the requirement to match the implementation, or claim the implementation meets the requirement.
4. Ask the product owner to decide whether the feature should be implemented, the requirement changed, or the scope explicitly deferred.
5. Update the PRD only after the decision is approved. Record implementation status separately from product intent.

A schema type, UI label, closed PR, or PR description alone is not proof that a feature is usable or deployed.

## 4. Security and data integrity

- Treat browser input, invitation content, uploaded files, and external responses as untrusted.
- Validate server-action inputs and enforce ownership/role checks server-side.
- Never trust client-supplied role or ownership identifiers.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or other private credentials to client code.
- Keep schema changes in version-controlled migrations and distinguish merged migrations from applied migrations.
- Avoid logging secrets or private user data.

## 5. Product and design guardrails

- LARISÉ's approved visual direction is minimal editorial + modern luxe.
- Marketing/editorial UI uses Rosehot and Satoshi within the frontend styling scope; dashboard/admin uses Geist; published invitation typography follows its selected theme.
- Preserve concise, grounded copy and accessible, responsive behavior.
- Do not invent product behavior, success states, metrics, testimonials, or completed features.
