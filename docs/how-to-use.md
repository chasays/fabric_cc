

# quick start

```Sh
npm install
npm i -D allure-commandline
npm run test:all
npm run report
```

# dependency

1. nodejs > 20+
2. java 8 (render report)


# record and generete init script

test account: 


`npx playwright codegen --target=typescript --output=docs/register-test.ts https://parabank.parasoft.com/parabank/index.htm`


# run with filter

`npm run test:e2e -- --grep "User Registration and Login Flow"`

more usages pls refer to [official url](https://playwright.dev/docs/test-cli#grep)
