# Playwright Automation Portfolio

---

## Overview

End-to-end and API test automation with Playwright and TypeScript, wired for CI/CD (GitHub Actions). The suite targets [Sauce Demo](https://www.saucedemo.com/) for UI flows and [DummyJSON](https://dummyjson.com/) for HTTP API checks using Playwright’s built-in `request` fixture.

---

## Demo
![Demo](./assets/%20demo.gif)

---

## Live test results in CI

![Test Results](./docs/test-results.svg)
[![CI - Playwright Tests](https://github.com/TheKalid/playwright-architecture-demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/TheKalid/playwright-architecture-demo/actions)

---

## Tech stack

- Playwright Test
- TypeScript
- GitHub Actions
- Node.js
- Allure (local reporting via `allure-playwright`)

---

## Key features

**UI (E2E)**

- Page Object Model with shared Playwright fixtures (`tests/fixtures`) injecting login, header, cart, checkout, and inventory pages
- Data-driven login scenarios for all documented Sauce Demo user types (standard, locked out, problem user, and others from `utils/users.ts`)
- Full purchase flow: login, add item, cart, checkout steps, and order completion assertion
- `baseURL` and `testIdAttribute: 'data-test'` aligned with Sauce Demo markup

**API**

- Contract-style checks against DummyJSON: auth (login, Bearer `/me`, token refresh), products (list, single, search, pagination, categories), and simulated create/update/delete responses

**Execution and quality**

- Parallel runs locally; CI-friendly retries and worker settings
- Traces on first retry
- Multi-browser projects: Chromium, Firefox, WebKit

---

## CI/CD pipeline

GitHub Actions:

1. Install dependencies
2. Install Playwright browsers
3. Run automated tests
4. Generate reports
5. Upload results as artifacts

Tests run on push to `main`, pull requests, and scheduled workflows.

---

## Run locally

Install dependencies and run the full suite:

```bash
npm install
npx playwright test
```

Run only UI or API tests:

```bash
npx playwright test tests/e2e
npx playwright test tests/api
```

Open the Allure report (after a run that produced `allure-results/`):

```bash
npx allure serve allure-results
```

For a Playwright HTML report on your machine:

```bash
npx playwright test --reporter=html
npx playwright show-report
```

---

## Test report

Each CI run uses **list**, **JSON**, and **HTML** reporters. After the job finishes you can download:

- **playwright-report** — HTML report (`index.html` after unzip)
- **test-results-json** — `test-results.json` (used to refresh `docs/test-results.svg` on push/schedule)

Locally, `playwright.config.ts` uses **list** plus **Allure** (`allure-results/`).

---

## Project structure

```
.
├── tests/
│   ├── e2e/           # Sauce Demo UI scenarios
│   ├── api/           # DummyJSON API tests (request context)
│   └── fixtures/      # Extended test with page object fixtures
├── pages/             # Page objects and components
├── utils/             # Shared test data (e.g. demo users)
├── playwright.config.ts
└── .github/workflows/
```

---

## What this project demonstrates

- Maintainable UI automation with fixtures and page objects
- API testing without a separate HTTP client, using Playwright `request`
- CI/CD integration and failure diagnostics (traces, CI artifacts)
- Clear separation between E2E and API suites under `tests/`

---

## Kalid M

SDET focused on reliable automation and testable delivery pipelines.

---
