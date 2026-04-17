# Obsidian Calendar Plugin

A calendar plugin for Obsidian that displays a calendar in the right sidebar with the ability to navigate between months and view notes created on specific dates.

## Features

- **Calendar View**: Display the current month with a clean, intuitive layout
- **Month Navigation**: Use left and right arrow buttons to navigate to previous/next months
- **Date Selection**: Click on any date to select it and view notes
- **Notes Display**: See all notes created on the selected date below the calendar
- **Visual Indicators**: Days with notes are highlighted for quick identification
- **Sidebar Integration**: Calendar appears in the right sidebar for easy access

## Installation

### For Development

1. Clone this repository to your Obsidian plugins folder:
   ```bash
   .obsidian/plugins/obsidian-calendar-plugin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development build:
   ```bash
   npm run dev
   ```

4. In Obsidian, enable the plugin in Settings → Community plugins → Installed plugins

### Building for Release

```bash
npm run production
```

This will create a compiled `main.js` file.

## Project Structure

```
├── main.ts              # Main plugin entry point
├── views/
│   └── calendar-view.ts # Calendar view implementation
├── styles.css           # Calendar styling
├── manifest.json        # Plugin metadata
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── esbuild.config.mjs   # Build configuration
└── .eslintrc            # ESLint configuration
```

## Usage

1. Click the calendar icon in the ribbon to open the calendar view
2. Use the arrow buttons to navigate to different months
3. Click on any date to select it
4. View all notes created on that date in the "Notes" section below
5. Click on any note to open it

## Development

### Commands

- **`npm run dev`** - Start development server with watch mode
- **`npm run esbuild`** - Build once
- **`npm run production`** - Build for production (minified)

### Dependencies

- **obsidian** - Obsidian API
- **typescript** - TypeScript compiler
- **esbuild** - JavaScript bundler
- **@typescript-eslint** - TypeScript linting

## How It Works

The plugin works by:

1. **Registering a Custom View**: The plugin registers a custom view type that appears in the right sidebar
2. **Calendar Rendering**: The calendar displays the current month with proper day positioning
3. **Date Selection**: When a date is clicked, it's marked as selected
4. **Notes Retrieval**: The plugin queries all vault notes and filters them by creation date
5. **Event Listeners**: The plugin listens for file create/delete/rename events to update the notes list

### Note Detection

Notes are associated with dates based on their file creation timestamp (`ctime` property). This means notes will appear on the same day they were created in Obsidian.

## Styling

The calendar uses Obsidian's CSS variables for theming, ensuring it integrates seamlessly with your chosen theme:

- `--background-primary` / `--background-secondary` / `--background-tertiary`
- `--text-normal` / `--text-muted` / `--text-accent`
- `--interactive-accent`
- `--divider-color`

## Future Enhancements

Potential improvements:

- Filter notes by folder
- Show note preview on hover
- Keyboard navigation
- Search within notes for selected date
- Customizable date format
- Note templates for new dates
- Sync with existing calendar events

## License

MIT

## Author

[Your Name]

## Support

For issues, feature requests, or contributions, please visit the repository.
