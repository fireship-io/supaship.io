# supaship.io

## Quick start

Make sure docker is running, then:

```bash
git clone https://github.com/fireship-io/supaship.io.git && \
  cd supaship.io && \
  yarn && \
  yarn add -D supabase && \
  yarn debug
```

^ Installs the app and runs e2e tests in debug mode. (Good for a quick overview of all the app does).

## Local Dev

Install the supabase cli (this needs to be done manually to get the cli bin):

```bash
yarn add -D supabase
```

Start supabase (make sure docker is running). This will run in background without taking a terminal, use `npx supabase stop` to end it.

```bash
npx supabase start --debug
```

Start dev server:

```bash
yarn dev
```

To watch tailwind styles, run this in another terminal while developing:

```bash
 npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

## Prod Build

```bash
yarn build
```

## Deploy

Manual. Run build and then drop `/dist` into Netlify buccket
(Will automate later)

## e2e

Note: will drop all data from tables when you run it.

```bash
yarn test
```

To step through tests:

```bash
yarn debug
```
