import { Plugin, WorkspaceLeaf } from 'obsidian';
import { CalendarView, VIEW_TYPE_CALENDAR } from './views/calendar-view';

export default class CalendarPlugin extends Plugin {
	async onload() {
		console.log('Loading Obsidian Calendar Plugin');

		// Register the calendar view
		this.registerView(
			VIEW_TYPE_CALENDAR,
			(leaf: WorkspaceLeaf) => new CalendarView(leaf)
		);

		// Add a ribbon icon to open the calendar view
		this.addRibbonIcon('calendar-glyph', 'Open Calendar', async () => {
			await this.activateView();
		});

		// Add a command to open the calendar
		this.addCommand({
			id: 'open-calendar',
			name: 'Open Calendar View',
			callback: async () => {
				await this.activateView();
			}
		});

		// Open the calendar view when the workspace is ready
		this.app.workspace.onLayoutReady(() => {
			this.activateView();
		});
	}

	onunload() {
		console.log('Unloading Obsidian Calendar Plugin');
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_CALENDAR);
	}

	async activateView() {
		try {
			const { workspace } = this.app;

			let leaf: WorkspaceLeaf | null = null;

			// Look for an existing calendar view
			const leaves = workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);
			if (leaves.length > 0) {
				leaf = leaves[0];
			} else {
				// Create a new leaf in the right sidebar
				leaf = workspace.getRightLeaf(false);
				if (leaf) {
					await leaf.setViewState({ type: VIEW_TYPE_CALENDAR, active: true });
				}
			}

			// Reveal the leaf
			if (leaf) {
				workspace.revealLeaf(leaf);
			}
		} catch (error) {
			console.error('Failed to activate calendar view:', error);
		}
	}
}
