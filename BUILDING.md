# Building BlockSuite

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup Environment](#setup-environment)
- [Play with Playground](#play-with-playground)
- [Build Packages](#build-packages)
- [Testing](#testing)

## Prerequisites

We suggest develop our product under node.js LTS(Long-term support) version

### Option 1: Manually install node.js

install [Node LTS version](https://nodejs.org/en/download)

> Up to now, the major node.js version is 18.x

### Option 2: Use node version manager

install [nvm](https://github.com/nvm-sh/nvm)

```sh
nvm install --lts
nvm use --lts
```

## Setup Environment

```sh
# enable built-in pnpm support
corepack enable
# install dependencies
pnpm install
```

## Play with Playground

```sh
pnpm dev
```

The playground page should work at [http://localhost:5173/?init](http://localhost:5173/?init)

## Build Packages

```sh
pnpm build
```

## Testing

Adding test cases is strongly encouraged when you contribute new features and bug fixes.

We use [Playwright](https://playwright.dev/) for E2E test, and [vitest](https://vitest.dev/) for unit test.

To test locally, please make sure browser binaries are already installed via `npx playwright install`. Then there are multi commands to choose from:

```sh
# run tests in headless mode in another terminal window
pnpm test

# or run tests in headed mode for debugging
pnpm test:headed
```

In headed mode, `await page.pause()` can be used in test cases to suspend the test runner. Note that the usage of the [Playwright VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) is also highly recommended.

To test browser compatibility, the `BROWSER` environment variable can be used:

```sh
# supports `firefox|webkit|chromium`
BROWSER=firefox pnpm test

# passing playwright params with the -- syntax
BROWSER=webkit pnpm test -- --debug
```

To investigate flaky tests, we can mark a test case as `test.only`, then perform `npx playwright test --repeat-each=10` to reproduce the problem by repeated execution. It's also very helpful to run `pnpm test -- --debug` with `await page.pause()` added before certain asserters.
