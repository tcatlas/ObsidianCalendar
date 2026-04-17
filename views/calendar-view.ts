import { WorkspaceLeaf, ItemView, TFile } from 'obsidian';

export const VIEW_TYPE_CALENDAR = 'calendar-view';

export class CalendarView extends ItemView {
	private currentDate: Date;
	private selectedDate: Date | null = null;
	private calendarContainer: HTMLElement | null = null;
	private notesContainer: HTMLElement | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.currentDate = new Date();
	}

	getViewType() {
		return VIEW_TYPE_CALENDAR;
	}

	getDisplayText() {
		return 'Calendar';
	}

	async onOpen() {
		this.createCalendarView();
		// registerEvent automatically detaches listeners when the view is closed
		this.registerEvent(this.app.vault.on('create', () => this.updateNotesList()));
		this.registerEvent(this.app.vault.on('delete', () => this.updateNotesList()));
		this.registerEvent(this.app.vault.on('rename', () => this.updateNotesList()));
	}

	async onClose() {
		// Nothing to clean up — registerEvent handles detaching listeners
	}

	private createCalendarView() {
		// Use contentEl per Obsidian docs: https://docs.obsidian.md/Plugins/User+interface/Views
		const container = this.contentEl;
		container.empty();

		const mainContainer = container.createDiv('calendar-main-container');
		
		// Create header with month/year and navigation
		const header = mainContainer.createDiv('calendar-header');
		
		const prevButton = header.createEl('button', { text: '←' });
		prevButton.addClass('calendar-nav-button');
		prevButton.onclick = () => this.previousMonth();

		const monthDisplay = header.createDiv('calendar-month-display');
		monthDisplay.setText(this.formatMonthYear(this.currentDate));

		const nextButton = header.createEl('button', { text: '→' });
		nextButton.addClass('calendar-nav-button');
		nextButton.onclick = () => this.nextMonth();

		// Create calendar grid
		this.calendarContainer = mainContainer.createDiv('calendar-grid-container');
		this.renderCalendar();

		// Create notes list container
		this.notesContainer = mainContainer.createDiv('calendar-notes-container');
		this.updateNotesList();
	}

	private renderCalendar() {
		if (!this.calendarContainer) return;

		this.calendarContainer.empty();

		// Add day labels (Sun, Mon, Tue, etc.)
		const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		daysOfWeek.forEach(day => {
			const dayLabel = this.calendarContainer!.createDiv('calendar-day-label');
			dayLabel.setText(day);
		});

		// Get first day of month and number of days
		const year = this.currentDate.getFullYear();
		const month = this.currentDate.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		// Add empty cells for days before month starts
		for (let i = 0; i < firstDay; i++) {
			this.calendarContainer.createDiv('calendar-empty-day');
		}

		// Add day cells
		for (let day = 1; day <= daysInMonth; day++) {
			const dayCell = this.calendarContainer.createDiv('calendar-day');
			dayCell.setText(day.toString());

			const date = new Date(year, month, day);
			dayCell.onclick = () => this.selectDate(date);

			// Check if this day is selected
			if (this.selectedDate && this.isSameDay(date, this.selectedDate)) {
				dayCell.addClass('calendar-day-selected');
			}

			// Check if notes exist for this date and highlight
			if (this.hasNotesForDate(date)) {
				dayCell.addClass('calendar-day-has-notes');
			}
		}
	}

	private selectDate(date: Date) {
		this.selectedDate = date;
		this.renderCalendar();
		this.updateNotesList();
	}

	private previousMonth() {
		this.currentDate = new Date(
			this.currentDate.getFullYear(),
			this.currentDate.getMonth() - 1,
			1
		);
		this.renderCalendar();
		this.updateNotesList();
	}

	private nextMonth() {
		this.currentDate = new Date(
			this.currentDate.getFullYear(),
			this.currentDate.getMonth() + 1,
			1
		);
		this.renderCalendar();
		this.updateNotesList();
	}

	private updateNotesList() {
		if (!this.notesContainer || !this.selectedDate) {
			if (this.notesContainer) {
				this.notesContainer.empty();
				const emptyMsg = this.notesContainer.createDiv('calendar-notes-empty');
				emptyMsg.setText('Select a date to view notes');
			}
			return;
		}

		this.notesContainer.empty();

		const notes = this.getNotesForDate(this.selectedDate);

		if (notes.length === 0) {
			const emptyMsg = this.notesContainer.createDiv('calendar-notes-empty');
			emptyMsg.setText(`No notes for ${this.formatDate(this.selectedDate)}`);
			return;
		}

		const header = this.notesContainer.createDiv('calendar-notes-header');
		header.setText(`Notes for ${this.formatDate(this.selectedDate)} (${notes.length})`);

		const notesList = this.notesContainer.createDiv('calendar-notes-list');

		notes.forEach(note => {
			const noteItem = notesList.createDiv('calendar-note-item');
			const noteLink = noteItem.createEl('a');
			noteLink.href = '#';
			noteLink.setText(note.basename || note.name);
			noteLink.onclick = (e) => {
				e.preventDefault();
				this.app.workspace.getLeaf(false).openFile(note);
			};
		});
	}

	private getNotesForDate(date: Date): TFile[] {
		const notes: TFile[] = [];

		// Get all markdown files and filter by creation date
		this.app.vault.getMarkdownFiles().forEach(file => {
			if (this.isNoteCreatedOnDate(file, date)) {
				notes.push(file);
			}
		});

		return notes.sort((a, b) => a.basename.localeCompare(b.basename));
	}

	private hasNotesForDate(date: Date): boolean {
		return this.app.vault.getMarkdownFiles().some(file =>
			this.isNoteCreatedOnDate(file, date)
		);
	}

	private isNoteCreatedOnDate(file: TFile, date: Date): boolean {
		const fileDate = new Date(file.stat.ctime);
		return this.isSameDay(fileDate, date);
	}

	private isSameDay(date1: Date, date2: Date): boolean {
		return date1.getDate() === date2.getDate() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getFullYear() === date2.getFullYear();
	}

	private formatDate(date: Date): string {
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const year = date.getFullYear();
		return `${year}-${month}-${day}`;
	}

	private formatMonthYear(date: Date): string {
		const months = ['January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'];
		return `${months[date.getMonth()]} ${date.getFullYear()}`;
	}
}
