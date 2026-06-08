# Login + Sign Up Best Practices — Workspace Skill

Summary
- Purpose: Capture a reusable, developer-facing workflow for implementing secure login and registration flows in this workspace.
- Scope: Workspace-scoped guidance for login/signup/auth-related functionality in web applications.

When to use
- When building or reviewing user authentication flows.
- When adding or improving signup, login, password reset, or protected route behavior.
- When choosing between session-based auth, token-based auth, and email verification.

Prerequisites
- A persistent user store or database with a user account model.
- Secure password hashing library available (`bcrypt`, `argon2`, or equivalent).
- Input validation and sanitization utilities.
- HTTPS available for production environments.

Principles
- Secure by default: treat auth endpoints as high-risk and apply strict validation, rate limits, and error handling.
- Minimal data exposure: never leak whether an email exists or whether the password or username was wrong.
- Strong credentials: hash passwords server-side, enforce uniqueness, and normalize identifiers.
- Clear UX: give users helpful guidance for registration, login failures, and account recovery.
- Reusable rules: encapsulate validation, hashing, and session/token logic in dedicated modules.

Step-by-step workflow
1. Define the user model and required fields.
   - Store only hashed passwords, user identifiers, and account metadata.
   - Keep sensitive state in the backend (e.g. `isVerified`, `failedLoginAttempts`, `passwordResetToken`).
2. Build signup/register behavior.
   - Validate payload fields: email, password, display name, terms acceptance.
   - Normalize email/username values before lookup.
   - Enforce unique credentials and reject duplicates with a generic response.
   - Hash passwords using a secure algorithm and store the hash only.
   - Optionally add email verification or welcome flows.
3. Build login behavior.
   - Accept identifier + password or email + password.
   - Lookup user by normalized identifier.
   - Use secure comparison for password hashes.
   - Reject failures with a generic message such as `Invalid email or password`.
   - Issue a session cookie or token only after successful authentication.
   - Record login events or failed attempts for audit/rate limiting.
4. Protect authenticated routes.
   - Add middleware to verify session cookies or bearer tokens.
   - Deny access to unauthenticated requests and redirect or respond with `401`.
5. Implement logout and session cleanup.
   - Invalidate tokens/sessions server-side when possible.
   - Clear cookies using secure attributes.
6. Add account recovery and change flows later.
   - Password reset should use short-lived tokens and secure email delivery.
   - Allow users to change email/password after re-authenticating.
7. Test auth flows thoroughly.
   - Happy path: valid signup, login, protected access, logout.
   - Error cases: duplicate signup, bad password, inactive account, expired session.
   - Security cases: invalid payloads, SQL/NoSQL injection inputs, rate-limit triggers.

Decision points and branching logic
- Session vs Token
  - Use server-side sessions for browser-based apps if you want simpler logout/invalidation.
  - Use JWT or bearer tokens for mobile APIs or separate frontends that require stateless auth.
- Email verification
  - Require verification for accounts that access sensitive or paid functionality.
  - Allow optional verification for lightweight apps, but keep verification paths ready.
- Password policy
  - Use a sensible minimum length and optional complexity rules.
  - Prefer user-friendly guidance over overly strict requirements.
- Auth strategy
  - Choose classic password-based auth for standard accounts.
  - Consider passwordless/email-link or social login only if it fits product needs.

Quality criteria / Completion checks
- No plaintext passwords are stored or logged.
- Email/username uniqueness is enforced at the database and application levels.
- Password hashing uses a secure algorithm and sufficient cost factor.
- Auth endpoints validate and sanitize all input.
- Error responses are consistent and do not reveal account existence.
- Protected routes correctly reject unauthorized access.
- Rate limits or throttling are in place for login/signup endpoints.
- Tests cover both success and failure cases for auth flows.

Recommended repository layout
- backend/src/routes/auth.js — signup/login/logout routes.
- backend/src/services/authService.js — password hashing, token/session issuance, validation.
- backend/src/db/userRepository.js — user lookups and persistence.
- backend/src/middleware/authMiddleware.js — request authentication checks.
- frontend/src/components/LoginPage.jsx — login form UX.
- frontend/src/components/SignUpPage.jsx — registration form UX.

Security & safety
- Use HTTPS everywhere in production.
- Set cookies with `Secure`, `HttpOnly`, and `SameSite` attributes.
- Limit login/signup attempts per IP or account.
- Log auth failures for monitoring and investigate unusual patterns.
- Keep password reset tokens short-lived and one-time-use.
- Avoid sending sensitive account details in redirects, query strings, or client-side logs.

Testing recommendations
- Unit test validation rules, hash verification, and auth service edge cases.
- Integration test the full signup/login/logout cycle.
- Include tests for duplicate account signup and invalid login.
- Use test accounts and isolated test data stores.

Example prompts to run this skill
- "Review the login/signup security checklist for this repo."
- "Create a signup route template with password hashing and duplicate email handling."
- "Add auth middleware guidance for protected API routes."

Ambiguities / questions
- Should this skill assume session cookies, JWTs, or both for this workspace's frontend/backend setup?
- Do you want email verification and password reset flows included as part of the standard workflow?

What this skill produces
- A compact, actionable workflow and checklist for implementing secure login and signup functionality.
- Practical decisions, quality checks, and test recommendations for auth-related work in this repo.

Next steps I can do for you
- Add a `backend/src/routes/auth.js` template and `frontend/src/components/SignUpPage.jsx` example.
- Create a reusable auth service module for password hashing and session/token issuance.
