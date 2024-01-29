# Readme

## Info

<https://papu.work>

Easy to use app for creating qr codes for payments. Split the bill with your friends. No more calculating who owes what. Just enter the amount and the app will generate a qr code for you. Maybe track payments in the future. Show a list of payments. Maybe even order food from a restaurant.

## Design

Figma <https://www.figma.com/file/cZUVgQmlWVU8qee804aJkq/Papu?type=design&node-id=2%3A5&mode=design&t=LY9qFN2pTo0R9HXC-1>

## Deployment

- Github Actions

### Merge on master

1. Build
2. Deploy

## Tech

- Docker <https://www.docker.com>
- Svelte <https://svelte.dev>
  - Node adapter
- Tailwind <https://tailwindcss.com>
- Typescript <https://www.typescriptlang.org>
- Vite <https://vitejs.dev>
- prettier <https://prettier.io>
- eslint <https://eslint.org>

## Tests TODO

- Vitest (Unit) <https://vitest.dev>
- Playwright (end-to-end) <https://playwright.dev>
- Github workflows testing <https://github.com/nektos/act>

## Developing

```bash
npm run dev

# open in browser
npm run dev -- --open
```

This will start DB, seed it with data and start the svelte app.

## Building

Done in Github Actions

Application is dockerized, Docekrfile is in root of the project.

Possible to run locally: `docker compose up`

**Be aware that .env is missing DB credentials and JWT secret!**

## TODO

### Global

- [ ] Add tests
- [x] Add CI/CD
- [ ] Kube?
- [ ] Test CI/CD
- [ ] Add analytics
- [ ] ELK stack?

### Main page

- [x] Add users
- [x] Add user items
- [x] Calculate user items
- [x] Generate QR code
- [x] Store orders locally to be able to restore them after refresh, or getting back to previous orders.
- [x] Add calc to all field to be able sum delivery and tip.
- [x] Add sale prec to user input. Some foods are not in sale and some are.
- [ ] Add sync with server. If user is logged in, sync orders with server.
- [ ] Add sync with other users. If user is logged in, sync orders with other users.
- [ ] Check payment status. If payment is done, mark it as paid.

### Login / Register

- [x] Add login
- [x] Add register
- [ ] Add forgot password
- [ ] Add reset password
- [ ] Add email verification
- [ ] Add social login
- [x] Animate form
- [x] Validate form (email, password)

### Profile

- [ ] Settings
- [ ] Change password
- [ ] Change email
- [ ] Change name
- [ ] Change avatar
- [ ] Add connection to slack
- [ ] Add connection to email (Auto recognize payments)
