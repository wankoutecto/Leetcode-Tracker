Tracker_tests — Playwright QA

This folder contains Playwright tests organized for UI, API, security, and performance checks.

How to run:

```bash
cd Tracker_tests
npm ci
npm run test        # run all tests
npm run test:api    # run API tests only
npm run test:security
npm run test:perf
```

Set `BASE_URL` environment variable to point tests at your backend (default http://localhost:8080).

Environment files

- Use `.env.template` as a template. Copy to `.env.local` for local runs or `.env.ci` for CI and update values.
- Playwright will load `.env.<TEST_ENV>` where `TEST_ENV` defaults to `local`.

Examples:

```bash
# run local tests
cd Tracker_tests
export TEST_ENV=local
npm run test:api

# run CI-style tests
export TEST_ENV=ci
npm run test:api
```

Page objects

- Tests use a simple Page Object Model under `tests/pages/`. Add more page classes there and reuse in `tests/ui/` specs.

Auth helpers

- Use `tests/helpers/auth.ts` to perform API login and retrieve a token for authenticated API or UI tests.
