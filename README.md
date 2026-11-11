# vimfluency

Learn Vim by doing. Interactive exercises for React developers: navigate code, search and replace, edit with motions and text objects, in a real Vim editor in the browser.

Everything runs client side. There is no backend.

Live: https://eehnsio.github.io/vimfluency/ (deployed from `main`)

## Getting started

```sh
npm install
npm run dev        # http://localhost:5173
```

| Command             | What it does                               |
| ------------------- | ------------------------------------------ |
| `npm test`          | Runs all tests, including every exercise solution |
| `npm run typecheck` | TypeScript check                           |
| `npm run lint`      | oxlint                                     |
| `npm run build`     | Static build in `dist/`                    |

## How it works

- The course is categories → lessons → exercises. A lesson explains one thing, you try it with hints (or watch it played back), then practice it a few times.
- Each exercise is data: a folder with `exercise.ts` and the real source files it uses.
- Every exercise is proven by a test: its reference solution is run through the same engine the browser uses, both directly and as real key presses through the lock.
- Each lesson unlocks the keys it teaches, and you keep everything you have learned. Keys that have not come up yet, arrow keys and the mouse are locked. Press `r` if you get stuck.

See `CLAUDE.md` for the architecture and how to add an exercise.
