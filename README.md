# Readme

## Info

[**Production website**](https://papu.vazacdaniel.com)

Easy to use app for creating qr codes for payments. Split the bill with your friends. No more calculating who owes what. Just enter the amount and the app will generate a qr code for you. Maybe track payments in the future. Show a list of payments. Maybe even order food from a restaurant.

## Deployment

- Tag and push to github
- Github actions will build and deploy to production site

## Tech

- Svelte <https://svelte.dev>
  - Static adapter
- Tailwind <https://tailwindcss.com>
- Typescript <https://www.typescriptlang.org>
- Vite <https://vitejs.dev>
- prettier <https://prettier.io>
- eslint <https://eslint.org>

## VSCode Extensions

- PostCSS Language Support
- Tailwind CSS IntelliSense
- Svelte for VS Code
- Playwright Test for VS Code

## Tests

- Vitest (Unit) <https://vitest.dev>
- Playwright (end-to-end) <https://playwright.dev>
- Github workflows testing <https://github.com/nektos/act>

## TODO

- [ ] Add ability to add new friend (Name, Price)
- [ ] Generate payment qr code
- [ ] User accounts
- [ ] Monitor payments
- [ ] Send qr code to user (email, text, slack, etc)
- [ ] Pull food from Bold, Foodora, etc
- [ ] Allow users to select food from menu
- [ ] Order food from restaurant

## Developing

```bash
npm run dev

# open in browser
npm run dev -- --open
```

## Building

```bash
npm run build

npm run preview
```
