# ObsidianCalendar

An Obsidian plugin that adds a calendar view in the side pane and shows notes by creation date.

## Features

- Calendar view in the Obsidian side pane
- Month and year navigation
- Click a day to show notes created on that date
- Click a week number to show notes created during that week
- Optional week numbers, configurable week start day, and note indicators
- Optional creation time and note excerpt display
- Configurable note sorting and excerpt line count

## Requirements

- Obsidian `0.12.0` or newer
- Node.js and npm for development

## Project Files

```text
main.ts                 Plugin entry point
views/calendar-view.ts  Calendar view UI and note list logic
settings.ts             Settings types, defaults, and settings tab UI
styles.css              Plugin styling
manifest.json           Obsidian plugin manifest
package.json            Scripts and development dependencies
```

## Development Setup

1. Clone this repository.
2. Install dependencies:

```bash
npm install
```

3. Build in watch mode during development:

```bash
npm run dev
```

4. Copy or symlink this plugin folder into your vault at:

```text
<your-vault>/.obsidian/plugins/notes-calendar/
```

5. In Obsidian, open `Settings -> Community plugins`, enable community plugins if needed, then enable `Notes Calendar`.

## Build Commands

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

The build outputs `main.js`, which Obsidian loads together with `manifest.json` and `styles.css`.

## Installing in a Vault

For a manual local install, make sure these files exist inside your plugin folder in the vault:

- `manifest.json`
- `main.js`
- `styles.css`

Example layout:

```text
<your-vault>/.obsidian/plugins/notes-calendar/
	manifest.json
	main.js
	styles.css
```

After copying the files, reload Obsidian or disable and re-enable the plugin.

## Usage

- Open the calendar from the ribbon icon or command palette.
- Use the left and right arrows to move between months.
- Click the month or year in the header to jump directly.
- Click a day to view notes created on that date.
- Click a week number to view notes created during that week.
- Use the plugin settings to configure note display, sorting, excerpts, week numbering, and note indicators.

## Notes

- Notes are grouped by file creation time (`ctime`), not by filename or frontmatter date.
- Week numbering can be shown as ISO 8601 or United States.
- The note list can be sorted by name or creation date/time, in ascending or descending order.

## License

MIT
