## Development Setup

1. Clone this repository.
2. Install dependencies:

```bash
npm install
```

3. Plugin TypeScript source lives under `src/`.

4. Build in watch mode during development:

```bash
npm run dev
```

5. Copy or symlink the `build/` directory into your vault as the plugin folder:

```text
<your-vault>/.obsidian/plugins/notes-calendar/
```

6. In Obsidian, open `Settings -> Community plugins`, enable community plugins if needed, then enable `Notes Calendar`.

## Build Commands

Lint the TypeScript source:

```bash
npm run lint
```

Development watch build:

```bash
npm run dev
```

Single build:

```bash
npm run esbuild
```

Production build:

```bash
npm run production
```

The build outputs `main.js` and `styles.css` into the `build/` directory. `manifest.json` is also copied there so the `build/` folder can be used directly as a plugin folder. Obsidian loads `main.js` together with `manifest.json` and `styles.css`.