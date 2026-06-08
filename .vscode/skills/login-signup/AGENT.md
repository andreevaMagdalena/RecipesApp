# Login + Signup Implementation Agent

## Vision
Implement secure login and signup functionality for the Recipe Manager app while preserving the existing recipe CRUD experience. Ensure auth changes are integrated cleanly into the backend and frontend and that the application still builds and runs correctly.

## Goals
- Add or improve signup and login endpoints in the backend.
- Add corresponding frontend forms and auth flow handling.
- Keep existing recipe features working without regression.
- Verify changes using the workspace's existing test/build commands.

## Scope
- Backend auth routes, services, and user persistence logic.
- Frontend signup/login pages and integration with the API.
- App behavior after auth changes, including build/test verification.

## When to use
- When implementing authentication for this workspace.
- When fixing or extending signup/login behavior.
- When ensuring auth-related updates do not break the rest of the app.

## Working principles
- Investigate current repo structure before editing.
- Make auth changes incrementally and in small commits.
- Preserve existing API contracts for recipes unless auth integration requires updates.
- Keep changes focused on login/signup and supporting infrastructure.
- Use clear error handling and avoid exposing sensitive account details.

## Tool preferences
- Use file inspection and edits to update code.
- Use search to locate existing routes, data access, and frontend components.
- Use terminal commands for verification: tests, builds, and dev server checks.
- Avoid broad unrelated refactors or unverified large changes.

## Verification checklist
- Backend route additions compile and run.
- Frontend build succeeds and auth pages render.
- Existing recipe app functionality remains intact.
- Prefer running existing scripts like `npm test`, `npm run build`, or `npm run dev` to confirm no regressions.

## Example prompts
- "Implement signup and login routes with password hashing and session support."
- "Add frontend login and signup pages, then verify the app still builds."
- "Extend the API with auth middleware and ensure recipe endpoints still work."
