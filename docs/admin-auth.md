VERVE Admin authentication uses an encrypted, HTTP-only cookie session.

Production secrets should be configured in Lovable Cloud secrets with at least 64 characters each:

- JWT_SECRET
- SESSION_SECRET
- ADMIN_SECRET
- ENCRYPTION_KEY

Compatibility aliases are supported:

- ADMIN_SESSION_SECRET can be used for SESSION_SECRET.
- ADMIN_PASSWORD can be used for ADMIN_SECRET.

Runtime safety:

- Short or missing session secrets are never passed to the session encryption library.
- If no 64+ character session secret exists, the app generates a cryptographically secure runtime-only fallback to prevent crashes.
- Runtime-only fallback sessions can reset after redeploys or cold starts, so production should use SESSION_SECRET or ADMIN_SESSION_SECRET.
- Admin password comparison is performed with a hash-based constant-time comparison.