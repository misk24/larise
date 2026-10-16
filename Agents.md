# LARISÉ AI Agent Instructions

These rules apply to AI coding agents and human contributors using AI assistance.

## 1. Required reading

Before planning a task, read:
1. `Agents.md`
2. `PRD.md` for product intent and scope
3. `Design_System.md` for UI work
4. `Architecture.md` for routing, data, auth, infrastructure, or cross-cutting work
5. Relevant source files, tests, migrations, and recent diffs

The repository is the source of truth for current implementation. Documentation provides intent and conventions, not permission to assume unverified behavior.

## 2. Workflow: Plan → Implement → Verify → Review

### Plan
Before editing:
- Restate the task and observable acceptance criteria.
- Inspect the relevant implementation and tests.
- List the files/areas likely to change and explain why.
- Identify data migration, authorization, accessibility, responsive, and regression risks.
- State assumptions and out-of-scope work.
- For non-trivial work, present the plan and wait for approval if the user has not already authorized implementation.

Do not plan from filenames alone. Read the actual code.

### Implement
- Make the smallest coherent change that meets the acceptance criteria.
- Follow the existing patterns and naming conventions.
- Reuse existing components, helpers, tokens, and Supabase clients.
- Do not rewrite unrelated files, reformat the whole project, or add dependencies without a concrete reason.
- Do not fabricate product data, testimonials, metrics, or success states.
- Preserve user data and backward compatibility.
- Never expose secrets or weaken authorization/RLS to make a feature work.
- Do not run destructive database commands or delete user data without explicit authorization.

### Verify
Run the most relevant checks, then broader checks when feasible:
1. `npm run lint`
2. `npm run typecheck`
3. `npm test`
4. `npm run test:e2e` for affected user journeys
5. `npm run build`

If an environment variable, external service, browser, or dependency prevents a check, state exactly which check was blocked and why. Never claim a check passed unless its result was observed.

For UI work, inspect mobile and desktop states, keyboard/focus behavior, loading/empty/error/success states, and reduced-motion behavior where applicable.

For data/auth work, inspect migrations, RLS, server-side authorization, and tests for anonymous/user/admin access as relevant.

### Review
Before finishing:
- Compare the diff against the original task.
- Look for accidental secrets, unrelated changes, unsafe SQL/RLS, broken imports, duplicated logic, and missing tests.
- Update docs when architecture, behavior, environment variables, or conventions changed.
- Summarize files changed, decisions, checks and actual outcomes, and unresolved risks.
- Do not merge or deploy unless explicitly requested.

## 3. Security rules

- Treat user input, invitation content, uploaded files, and external API responses as untrusted.
- Never commit secrets, tokens, private keys, service-role keys, or populated local environment files.
- Do not log credentials, authentication tokens, or unnecessary personal data.
- Validate input on the server; client validation is for usability, not security.
- Authorization must be enforced server-side and/or by database RLS.
- Never trust client-supplied role, owner ID, price, or permission flags.
- Avoid broadening RLS policies as a shortcut. Explain and test the least-privilege policy needed.
- Do not disable security checks or CI merely to obtain a green result.

## 4. UI and accessibility rules

- Follow `Design_System.md` and the existing token/component implementation.
- Prefer mobile-first layouts and semantic HTML.
- Preserve keyboard access, focus visibility, labels, and sufficient contrast.
- Respect reduced-motion settings and clean up animation effects.
- Use the existing animation library/pattern for the affected area; do not mix GSAP and Framer Motion in a component without a specific reason.
- Avoid fake content and excessive animation.

## 5. Code and data rules

- TypeScript types should represent actual data; do not silence errors with `any`, broad casts, or ignored diagnostics without a documented reason.
- Avoid duplicate Supabase clients and duplicate business logic.
- Inspect the actual schema and migrations before writing queries.
- Use migrations for schema changes and preserve existing data.
- Add tests for bug fixes and meaningful behavior changes.
- Do not change package versions or install dependencies unless required and justified.
- Keep changes focused and make error handling explicit.

## 6. Git and delivery

- Work on a task-specific branch unless the user explicitly requests direct changes to the default branch.
- Use descriptive commits and a focused pull request.
- Never force-push, rewrite shared history, merge, or deploy without explicit authorization.
- Do not claim remote changes, test results, or deployments that have not been confirmed.
- If the task is ambiguous in a way that could affect security, data loss, or architectural direction, stop and ask a concise question.

## 7. Completion report

Always report:
- What changed and why.
- Files changed.
- Checks actually run and their outcomes.
- Anything not verified and the reason.
- PR/branch links when created.

Be direct. Correctness and safety matter more than claiming completion quickly.
