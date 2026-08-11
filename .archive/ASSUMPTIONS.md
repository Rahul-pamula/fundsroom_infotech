## Assumptions

Date: 2026-08-10

- `SUPABASE_URL` and `SUPABASE_ANON_KEY` already present in the root `.env` are preserved for compatibility, but normal application CRUD uses backend PostgreSQL access through `DATABASE_URL`.
- `DATABASE_URL` must be supplied by the evaluator or developer because the repository does not contain database credentials.
- Seed users use assessment-only credentials documented in `README.md`; they are not production secrets.
- Database-backed integration and concurrency tests are included but gated behind `RUN_DB_TESTS=true` so the default test suite can run without requiring live PostgreSQL credentials.
- Local Docker uses a development PostgreSQL container for reproducibility; deployed environments should use Supabase PostgreSQL.

