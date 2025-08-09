# Parabank Test Automation

E2E test automation for Parabank using Playwright.

## Quick Start

### docker-compose

`docker-compose -f docker/docker-compose.yml up`

###  1: Use Docker Hub Image (Recommended)
```bash
docker run --rm \
  -v $(pwd)/reports:/app/reports \
  -v $(pwd)/allure-results:/app/allure-results \
  ievjai/parabank-tests:latest pnpm run test:ui

```
here is the test types:

- `npm run test:ui` - UI tests
- `npm run test:api` - API tests  
- `npm run test:e2e` - E2E tests
- `npm run test:all` - All tests


## View Reports

```
docker run --rm \
  -v $(pwd)/reports:/app/reports \
  -v $(pwd)/allure-results:/app/allure-results \
  -p 5050:5050 \
  ievjai/parabank-tests:latest pnpm run report
```

Open http://localhost:5050 for Allure reports.


## That's it!
