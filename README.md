# Wall Calendar — Interactive React Component

A polished, fully interactive wall-calendar component built with **Next.js 14** and **React 18**, styled entirely with CSS Modules (no UI library dependency).

---

## Features

| Feature | Details |
|---|---|
| **Wall calendar aesthetic** | Spiral binding, hero image area, zigzag chevron divider, Playfair Display serif month name |
| **Day range selector** | Click start → hover to preview → release to set end. Distinct visual states for start, end, in-between |
| **Month notes** | Lined-paper textarea synced per month, persisted via `localStorage` |
| **Day notes** | Per-day textarea appears when a single day is selected |
| **Holiday markers** | 12 common holidays auto-labeled on their dates |
| **5 colour themes** | alpine · forest · desert · dusk · ocean — cycles via the theme button, preference persisted |
| **Note indicators** | Small dot on any day that has a saved note |
| **Smooth animations** | Slide-in animation on month change |
| **Fully responsive** | Side-by-side on desktop → stacked on mobile, touch-friendly |
| **No backend** | All state in React + `localStorage`, zero API calls |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
# Production build
npm run build
npm start
```

---

## Project Structure

```
src/
  components/
    WallCalendar.jsx          # Main component (all sub-components co-located)
    WallCalendar.module.css   # Scoped styles
  pages/
    _app.jsx                  # Global reset + font import
    _app.css
    index.jsx                 # Entry page
```

### Architecture Decisions

- **Single component file** — `WallCalendar.jsx` contains all sub-components (`Binding`, `Hero`, `NotesPanel`, `DayCell`). This keeps the calendar self-contained and easy to copy into any project.
- **Pure render functions** — The day grid is derived entirely from `(year, month, rangeState)` with no side effects. Navigation simply updates `viewDate`.
- **CSS Modules** — Zero runtime CSS-in-JS overhead, full scoping, straightforward dark-mode extension via `:root` overrides if needed.
- **`localStorage` via custom hook** — `useLocalStorage(key, initial)` handles read-on-mount + write-on-change, keeping notes durable across reloads without any backend.
- **Monday-first grid** — Week starts Monday (ISO standard), with Saturday in blue and Sunday in red matching common European calendar conventions.

### Extending

**Add a custom hero image per month:**
Replace the `background` gradient in `Hero` with an `<img>` or CSS `background-image` url keyed to `month`.

**Dark mode:**
Add a `[data-theme="dark"]` selector block in `WallCalendar.module.css` overriding the colour variables, and toggle via a button that sets `document.documentElement.dataset.theme`.

**Touch range selection:**
Add `onTouchStart` / `onTouchMove` handlers mirroring the mouse events, using `document.elementFromPoint(touch.clientX, touch.clientY)` to resolve the hovered cell.

---

## Deploy to Vercel

```bash
npx vercel
```

One-click deploy — no environment variables required.
