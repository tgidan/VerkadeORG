# verkade.org — Personal Portfolio Website

A personal portfolio website for Daan Verkade, built as a single-page React application with a cybersecurity/developer aesthetic. Features smooth scroll-based navigation, animated sections, a dynamic theme system, and an interactive terminal easter egg.

---

## Tech Stack

| Layer          | Technology             |
| -------------- | ---------------------- |
| Framework      | React 19 + TypeScript  |
| Build tool     | Vite 6                 |
| Styling        | Tailwind CSS v4        |
| Animation      | Motion (Framer Motion) |
| Icons          | Lucide React           |
| UI primitives  | Radix UI (shadcn/ui)   |

---

## Getting Started

Install dependencies (use `pnpm` or `npm`):

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Deploy to the remote server:

```bash
./deploy.sh
```

---

## Project Structure

```text
src/
├── app/
│   ├── App.tsx              # Root component — layout, sections, state
│   └── components/
│       ├── Terminal.tsx     # Interactive terminal overlay
│       └── MatrixRain.tsx   # Canvas-based Matrix rain effect
├── assets/
│   └── DVerkade.png         # Profile photo
└── main.tsx                 # React entry point
```

---

## App.tsx

`App.tsx` is the root component. It owns all shared state and renders every page section.

### State

| State           | Type            | Purpose                                                        |
| --------------- | --------------- | -------------------------------------------------------------- |
| `activeSection` | `string`        | Tracks which nav item is highlighted                           |
| `terminalOpen`  | `boolean`       | Controls terminal visibility                                   |
| `hueRotate`     | `number or null` | CSS hue-rotate value for theme changes; `null` = default cyan |
| `isFlipped`     | `boolean`       | Applies `rotate(180deg)` to the entire page                   |
| `matrixOn`      | `boolean`       | Toggles the MatrixRain overlay                                 |

### Keyboard Shortcut

`Ctrl + \`` (backtick) toggles the terminal open/closed from anywhere on the page.

### Page Sections

Sections are rendered sequentially and use `id` attributes for smooth-scroll navigation. The nav bar and terminal `cd` command both scroll to these IDs.

| Section ID | Content |
|---|---|
| `home` | Hero — name, title, profile image, status card, CTA buttons |
| `skills` | Scrolling tag cloud of skill keywords |
| `about` | Bio paragraph and highlights |
| `career` | Timeline of roles with bullet-point highlights |
| `education` | Academic history (MSc, BSc, high school) |
| `projects` | Project ICARUS, Flipper Zero, and others |
| `writing` | Placeholder for future articles/posts |
| `contact` | Email and GitHub links |

### Theme System

The `hueRotate` state applies a CSS `hue-rotate` filter to the entire page root, which shifts all cyan accents to a different colour. The terminal `theme` command drives this. Available themes:

| Name | Hue offset |
|---|---|
| `cyan` / `default` | none (native cyan) |
| `purple` | +90° |
| `green` | −60° |
| `red` | +180° |
| `orange` | −150° |
| `pink` | +60° |

---

## Terminal.tsx

A floating terminal overlay rendered at the bottom of the viewport. It mimics a Unix shell and is the primary interactive easter egg on the site.

### Props

```ts
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onThemeChange: (hue: number | null) => void;
  onFlip: () => void;
  onMatrixToggle: (on: boolean) => void;
  isFlipped: boolean;
  matrixOn: boolean;
}
```

Effects that change the page (`theme`, `flip`, `matrix`) are lifted to `App.tsx` via callbacks. The terminal holds no page-level state of its own.

### Window Controls

The title bar replicates macOS traffic-light buttons:
- **Red** — closes the terminal (`onClose`)
- **Yellow** — minimises/restores (collapses output, keeps the bar visible)
- **Green** — maximises/restores (full-screen vs bottom panel)

### Keyboard Shortcuts (inside terminal)

| Key | Action |
|---|---|
| `Enter` | Submit command |
| `Arrow Up` | Navigate command history (older) |
| `Arrow Down` | Navigate command history (newer) |
| `Ctrl + L` | Clear terminal output |

Command history stores the last 50 commands.

### Line Types & Colours

| Type | Colour | Used for |
|---|---|---|
| `input` | white | Echoed command the user typed |
| `output` | gray-300 | Normal output text |
| `success` | cyan-400 | Positive results, ASCII art headers |
| `error` | red-400 | Error messages |
| `system` | yellow-300 | Meta/system messages, hints |

### Available Commands

#### Standard Commands

| Command | Description |
|---|---|
| `help` | List all commands |
| `cd <section>` | Smooth-scroll to a page section (`home`, `about`, `career`, `education`, `projects`, `skills`, `contact`) |
| `about` | Short bio |
| `skills` | Skill list |
| `projects` | Project list |
| `whoami` | Visitor identification (joke output) |
| `ls [-a]` | List directory; `-a` / `-la` / `-al` / `-lah` reveal hidden files |
| `cat <file>` | Read a file (`about.txt`, `skills.txt`, `contact.txt`, or hidden files) |
| `echo <msg>` | Echo text back |
| `ping <host>` | Simulated ping output |
| `date` | Current date and time |
| `history` | Command history |
| `clear` | Clear terminal output |
| `exit` / `quit` / `close` | Close the terminal |

#### Hidden / Easter Egg Commands

These are not listed in `help` but are discoverable via `ls -a` and `cat .secret`:

| Command | Effect |
|---|---|
| `matrix` | Toggle the MatrixRain canvas overlay on/off |
| `flip` | Rotate the entire page 180° (toggle) |
| `theme <color>` | Change the site colour theme |
| `neofetch` | ASCII art system info card |
| `coffee` | ASCII art coffee cup |
| `hack` | Fake hacking sequence with humorous failure messages |
| `sudo make me a sandwich` | Classic Unix joke |
| `sudo rm ...` | Permission denied joke |
| `sudo hack the planet` | HACK THE PLANET! |
| `konami` | Responds to the Konami code reference |

#### Discovery Path

1. Run `ls -a` to see hidden files (`.secret`, `.matrix`, `.flip`)
2. Run `cat .secret` to reveal the unlockable command list

---

## MatrixRain.tsx

A full-screen canvas overlay that renders falling Katakana/ASCII characters in cyan (`#22d3ee`), matching the site accent colour. It:

- Initialises column count and drop positions based on viewport width
- Redraws every 40 ms using a semi-transparent fill to create the trailing fade effect
- Listens to `window resize` and reinitialises accordingly
- Renders above all content (`z-index: 35`) but is non-interactive (`pointer-events: none`)
- Rendered by `App.tsx` only when `matrixOn === true`
