# Notes Calendar

An Obsidian plugin for displaying a calendar in the side pane and notes associated with the selected date.

## Screenshots
<img width="405" height="750" alt="Notes pane display showing the calendar and notes list." src="https://github.com/user-attachments/assets/1328a8ab-2a27-45ad-8750-9a4faaff0dfb" />


## Features

- Calendar view in the side pane
- Month and year navigation
- Click a day to show notes created on that date
- Click a week number to show notes created during that week
- Optional week numbers, configurable week start day, and note indicators
- Optional creation time and note excerpt display
- Configurable note sorting and excerpt line count

## Installation
Open the Community Plugins tab in the settings and search for "Calendar Notes" (or [click here](https://obsidian.md/plugins?id=calendar-notes)).

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

## Notes

- Notes are grouped by file creation time (`ctime`), not by filename or frontmatter date.
- Week numbering can be shown as ISO 8601 or United States.
- The note list can be sorted by name or creation date/time, in ascending or descending order.

## License

GPL 2.0
