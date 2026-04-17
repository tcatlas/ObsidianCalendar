var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => CalendarPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

// views/calendar-view.ts
var import_obsidian2 = require("obsidian");

// settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  showDashes: true,
  dashOneThreshold: 1,
  dashTwoThreshold: 3,
  dashThreeThreshold: 5,
  showTime: true,
  timeIsoDisplay: "HH:mm:ss",
  showExcerpt: true,
  excerptLines: 2,
  noteSortBy: "creation-time",
  noteSortOrder: "ascending",
  weekStartDay: "sunday",
  weekNumberDisplay: "off"
};
function normalizeTimeDisplayFormat(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_SETTINGS.timeIsoDisplay;
  }
  return trimmed;
}
function normalizeWeekNumberDisplay(value) {
  if (value === "iso-8601" || value === "international") {
    return "iso-8601";
  }
  if (value === "united-states") {
    return "united-states";
  }
  return "off";
}
function normalizeExcerptLines(value) {
  if (value < 1) return 1;
  if (value > 3) return 3;
  return Math.round(value);
}
function normalizeNoteSortBy(value) {
  return value === "creation-time" ? "creation-time" : "name";
}
function normalizeSortOrder(value) {
  return value === "descending" ? "descending" : "ascending";
}
function formatDateTime(date, format) {
  const padNumber = (value, width) => {
    const zeros = width === 3 ? "000" : "00";
    return (zeros + String(value)).slice(-width);
  };
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour24 = date.getHours();
  const hour12 = hour24 % 12 || 12;
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const millisecond = date.getMilliseconds();
  const meridiem = hour24 >= 12 ? "PM" : "AM";
  const replacements = {
    "YYYY": String(year),
    "YY": String(year).slice(-2),
    "MM": padNumber(month, 2),
    "M": String(month),
    "DD": padNumber(day, 2),
    "D": String(day),
    "HH": padNumber(hour24, 2),
    "H": String(hour24),
    "hh": padNumber(hour12, 2),
    "h": String(hour12),
    "mm": padNumber(minute, 2),
    "m": String(minute),
    "ss": padNumber(second, 2),
    "s": String(second),
    "SSS": padNumber(millisecond, 3),
    "aa": meridiem,
    "a": meridiem.toLowerCase()
  };
  const tokenPattern = /(YYYY|YY|SSS|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|aa|a)/g;
  return format.replace(tokenPattern, (token) => replacements[token] ?? token);
}
var CalendarSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Notes Calendar Settings" });
    containerEl.createEl("h3", { text: "Note List" });
    new import_obsidian.Setting(containerEl).setName("Show creation time").setDesc("Display note creation time.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showTime).onChange(async (value) => {
        this.plugin.settings.showTime = value;
        await this.plugin.saveSettings();
        this.plugin.refreshCalendarView();
        timeFormatSetting.settingEl.style.display = value ? "" : "none";
      })
    );
    const timeFormatSetting = new import_obsidian.Setting(containerEl).setName("Time display format").setDesc(this.buildTimeFormatDesc(this.plugin.settings.timeIsoDisplay)).addText(
      (text) => text.setPlaceholder("HH:mm:ss").setValue(this.plugin.settings.timeIsoDisplay).onChange(async (value) => {
        this.plugin.settings.timeIsoDisplay = normalizeTimeDisplayFormat(value);
        await this.plugin.saveSettings();
        this.plugin.refreshCalendarView();
        timeFormatSetting.setDesc(this.buildTimeFormatDesc(this.plugin.settings.timeIsoDisplay));
      })
    );
    timeFormatSetting.settingEl.style.display = this.plugin.settings.showTime ? "" : "none";
    new import_obsidian.Setting(containerEl).setName("Sort notes by").setDesc("Choose how notes are sorted in the note list.").addDropdown(
      (dropdown) => dropdown.addOption("name", "Name").addOption("creation-time", "Creation date/time").setValue(this.plugin.settings.noteSortBy).onChange(async (value) => {
        this.plugin.settings.noteSortBy = normalizeNoteSortBy(value);
        await this.plugin.saveSettings();
        this.plugin.refreshCalendarView();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Sort order").setDesc("Choose whether notes are shown ascending or descending.").addDropdown(
      (dropdown) => dropdown.addOption("ascending", "Ascending").addOption("descending", "Descending").setValue(this.plugin.settings.noteSortOrder).onChange(async (value) => {
        this.plugin.settings.noteSortOrder = normalizeSortOrder(value);
        await this.plugin.saveSettings();
        this.plugin.refreshCalendarView();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Show excerpt").setDesc("Display a short preview of each note's content.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showExcerpt).onChange(async (value) => {
        this.plugin.settings.showExcerpt = value;
        await this.plugin.saveSettings();
        this.plugin.refreshCalendarView();
        excerptSection.style.display = value ? "" : "none";
      })
    );
    const excerptSection = containerEl.createDiv();
    excerptSection.style.marginLeft = "24px";
    excerptSection.style.paddingLeft = "12px";
    excerptSection.style.borderLeft = "1px solid var(--background-modifier-border)";
    const excerptLinesSetting = new import_obsidian.Setting(excerptSection).setName("Excerpt lines").setDesc("Specify the maximum number of lines to show in note excerpts.").addDropdown(
      (dropdown) => dropdown.addOption("1", "1").addOption("2", "2").addOption("3", "3").addOption("4", "4").addOption("5", "5").setValue(String(this.plugin.settings.excerptLines)).onChange(async (value) => {
        this.plugin.settings.excerptLines = normalizeExcerptLines(parseInt(value, 10));
        await this.plugin.saveSettings();
        this.plugin.refreshCalendarView();
      })
    );
    excerptSection.style.display = this.plugin.settings.showExcerpt ? "" : "none";
    containerEl.createEl("h3", { text: "Calendar Display" });
    new import_obsidian.Setting(containerEl).setName("Week starts on").setDesc("Choose the first day shown in each week.").addDropdown(
      (dropdown) => dropdown.addOption("sunday", "Sunday").addOption("monday", "Monday").setValue(this.plugin.settings.weekStartDay).onChange(async (value) => {
        this.plugin.settings.weekStartDay = value === "monday" ? "monday" : "sunday";
        await this.plugin.saveSettings();
        this.plugin.refreshCalendarView();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Week numbers").setDesc("Display week numbers in the calendar.").addDropdown(
      (dropdown) => dropdown.addOption("off", "Off").addOption("iso-8601", "ISO 8601").addOption("united-states", "United States").setValue(this.plugin.settings.weekNumberDisplay).onChange(async (value) => {
        this.plugin.settings.weekNumberDisplay = normalizeWeekNumberDisplay(value);
        await this.plugin.saveSettings();
        this.plugin.refreshCalendarView();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Show note indicators").setDesc("Display indicators on days that have notes.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showDashes).onChange(async (value) => {
        this.plugin.settings.showDashes = value;
        await this.plugin.saveSettings();
        this.plugin.refreshCalendarView();
        thresholdSection.style.display = value ? "" : "none";
      })
    );
    const thresholdSection = containerEl.createDiv();
    thresholdSection.style.marginLeft = "24px";
    thresholdSection.style.paddingLeft = "12px";
    thresholdSection.style.borderLeft = "1px solid var(--background-modifier-border)";
    thresholdSection.style.display = this.plugin.settings.showDashes ? "" : "none";
    thresholdSection.createEl("p", {
      text: "Set the minimum number of notes required for each indicator level.",
      cls: "setting-item-description"
    });
    new import_obsidian.Setting(thresholdSection).setName("One").addText(
      (text) => text.setPlaceholder("1").setValue(String(this.plugin.settings.dashOneThreshold)).onChange(async (value) => {
        const num = parseInt(value, 10);
        if (!isNaN(num) && num >= 1) {
          this.plugin.settings.dashOneThreshold = num;
          await this.plugin.saveSettings();
          this.plugin.refreshCalendarView();
        }
      })
    );
    new import_obsidian.Setting(thresholdSection).setName("Two").addText(
      (text) => text.setPlaceholder("3").setValue(String(this.plugin.settings.dashTwoThreshold)).onChange(async (value) => {
        const num = parseInt(value, 10);
        if (!isNaN(num) && num >= 1) {
          this.plugin.settings.dashTwoThreshold = num;
          await this.plugin.saveSettings();
          this.plugin.refreshCalendarView();
        }
      })
    );
    new import_obsidian.Setting(thresholdSection).setName("Three").addText(
      (text) => text.setPlaceholder("5").setValue(String(this.plugin.settings.dashThreeThreshold)).onChange(async (value) => {
        const num = parseInt(value, 10);
        if (!isNaN(num) && num >= 1) {
          this.plugin.settings.dashThreeThreshold = num;
          await this.plugin.saveSettings();
          this.plugin.refreshCalendarView();
        }
      })
    );
  }
  buildTimeFormatDesc(format) {
    const now = /* @__PURE__ */ new Date();
    const preview = formatDateTime(now, format);
    return `Example: HH:mm, hh:mm:ss aa, YYYY-MM-DD. Preview: ${preview}`;
  }
};

// views/calendar-view.ts
var VIEW_TYPE_CALENDAR = "calendar-view";
var CalendarView = class extends import_obsidian2.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.selectedDate = null;
    this.selectedWeekStart = null;
    this.calendarContainer = null;
    this.notesContainer = null;
    this.monthDisplayContainer = null;
    this.monthDisplayButton = null;
    this.yearDisplayButton = null;
    this.headerSelectorPopover = null;
    this.activeHeaderSelector = null;
    this.plugin = plugin;
    this.currentDate = /* @__PURE__ */ new Date();
    this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate());
    this.yearSelectorCenter = this.currentDate.getFullYear();
  }
  getViewType() {
    return VIEW_TYPE_CALENDAR;
  }
  getDisplayText() {
    return "Calendar";
  }
  getIcon() {
    return "calendar-1";
  }
  async onOpen() {
    this.createCalendarView();
    this.registerEvent(this.app.vault.on("create", () => this.updateNotesList()));
    this.registerEvent(this.app.vault.on("delete", () => this.updateNotesList()));
    this.registerEvent(this.app.vault.on("rename", () => this.updateNotesList()));
    this.registerDomEvent(document, "click", (event) => {
      if (!this.activeHeaderSelector || !this.monthDisplayContainer) return;
      if (!this.monthDisplayContainer.contains(event.target)) {
        this.closeHeaderSelector();
      }
    });
  }
  async onClose() {
  }
  // Called by the plugin when settings change
  refresh() {
    this.renderHeader();
    this.renderCalendar();
    this.updateNotesList();
    this.renderHeaderSelector();
  }
  createCalendarView() {
    const container = this.contentEl;
    container.empty();
    const mainContainer = container.createDiv("calendar-main-container");
    const header = mainContainer.createDiv("calendar-header");
    const prevButton = header.createEl("button", { text: "\u2190" });
    prevButton.addClass("calendar-nav-button");
    prevButton.onclick = () => this.previousMonth();
    this.monthDisplayContainer = header.createDiv("calendar-month-display");
    this.monthDisplayButton = this.monthDisplayContainer.createEl("button", { cls: "calendar-month-display-button" });
    this.monthDisplayButton.type = "button";
    this.monthDisplayButton.onclick = (event) => {
      event.stopPropagation();
      this.openMonthSelector();
    };
    this.yearDisplayButton = this.monthDisplayContainer.createEl("button", { cls: "calendar-month-display-button" });
    this.yearDisplayButton.type = "button";
    this.yearDisplayButton.onclick = (event) => {
      event.stopPropagation();
      this.openYearSelector();
    };
    this.renderHeader();
    const nextButton = header.createEl("button", { text: "\u2192" });
    nextButton.addClass("calendar-nav-button");
    nextButton.onclick = () => this.nextMonth();
    this.calendarContainer = mainContainer.createDiv("calendar-grid-container");
    this.renderCalendar();
    this.notesContainer = mainContainer.createDiv("calendar-notes-container");
    this.updateNotesList();
  }
  renderCalendar() {
    if (!this.calendarContainer) return;
    this.calendarContainer.empty();
    const showWeekNumbers = this.plugin.settings.weekNumberDisplay !== "off";
    this.calendarContainer.style.gridTemplateColumns = showWeekNumbers ? "auto repeat(7, 1fr)" : "repeat(7, 1fr)";
    if (showWeekNumbers) {
      const weekLabel = this.calendarContainer.createDiv("calendar-week-label");
      weekLabel.setText(this.getQuarterLabel(this.currentDate));
    }
    const daysOfWeek = this.getDaysOfWeek();
    daysOfWeek.forEach((day) => {
      const dayLabel = this.calendarContainer.createDiv("calendar-day-label");
      dayLabel.setText(day);
    });
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = this.getFirstDayOffset(new Date(year, month, 1).getDay());
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalWeeks = Math.ceil((firstDay + daysInMonth) / 7);
    for (let week = 0; week < totalWeeks; week++) {
      const weekStartDate = this.getCalendarRowStartDate(year, month, week, firstDay);
      if (showWeekNumbers) {
        const weekNumberCell = this.calendarContainer.createDiv("calendar-week-number");
        weekNumberCell.addClass("is-clickable");
        const weekNumberValue = weekNumberCell.createDiv("calendar-week-number-value");
        weekNumberCell.createDiv("calendar-week-number-spacer");
        if (this.selectedWeekStart && this.isSameDay(weekStartDate, this.selectedWeekStart)) {
          weekNumberCell.addClass("is-selected");
        }
        weekNumberValue.setText(String(this.getWeekNumberForRow(weekStartDate)));
        weekNumberCell.onclick = () => this.selectWeek(weekStartDate);
      }
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const day = week * 7 + dayIndex - firstDay + 1;
        if (day < 1 || day > daysInMonth) {
          this.calendarContainer.createDiv("calendar-empty-day");
          continue;
        }
        const date = new Date(year, month, day);
        const dayCell = this.calendarContainer.createDiv("calendar-day");
        const dayNumber = dayCell.createDiv("calendar-day-number");
        dayNumber.setText(day.toString());
        const noteCount = this.countNotesForDate(date);
        const dashCount = this.getDashCount(noteCount);
        const dashEl = dayCell.createDiv("calendar-day-dashes");
        if (this.plugin.settings.showDashes && dashCount > 0) {
          for (let i = 0; i < dashCount; i++) {
            dashEl.createSpan("calendar-day-dash");
          }
        }
        dayCell.onclick = () => this.selectDate(date);
        if (this.selectedWeekStart && this.isDateInWeek(date, this.selectedWeekStart)) {
          dayCell.addClass("calendar-day-in-selected-week");
        }
        if (this.selectedDate && this.isSameDay(date, this.selectedDate)) {
          dayCell.addClass("calendar-day-selected");
        }
      }
    }
  }
  getFirstDayOffset(day) {
    return this.plugin.settings.weekStartDay === "monday" ? (day + 6) % 7 : day;
  }
  getDaysOfWeek() {
    if (this.plugin.settings.weekStartDay === "monday") {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    }
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  }
  getWeekNumber(date) {
    if (this.plugin.settings.weekNumberDisplay === "iso-8601") {
      return this.getIsoWeekNumber(date);
    }
    return this.getUnitedStatesWeekNumber(date);
  }
  getWeekNumberForRow(weekStartDate) {
    return this.getWeekNumber(this.getDisplayedWeekAnchorDate(weekStartDate));
  }
  getDisplayedWeekAnchorDate(weekStartDate) {
    const offset = this.plugin.settings.weekStartDay === "monday" ? 3 : 4;
    return new Date(
      weekStartDate.getFullYear(),
      weekStartDate.getMonth(),
      weekStartDate.getDate() + offset
    );
  }
  getIsoWeekNumber(date) {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNumber = utcDate.getUTCDay() || 7;
    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNumber);
    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
    return Math.ceil(((utcDate.getTime() - yearStart.getTime()) / 864e5 + 1) / 7);
  }
  getUnitedStatesWeekNumber(date) {
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const yearStart = new Date(normalized.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((normalized.getTime() - yearStart.getTime()) / 864e5);
    const jan1Day = yearStart.getDay();
    return Math.floor((dayOfYear + jan1Day) / 7) + 1;
  }
  selectDate(date) {
    this.selectedDate = date;
    this.selectedWeekStart = null;
    this.renderCalendar();
    this.updateNotesList();
  }
  selectWeek(weekStartDate) {
    this.selectedWeekStart = new Date(
      weekStartDate.getFullYear(),
      weekStartDate.getMonth(),
      weekStartDate.getDate()
    );
    this.selectedDate = null;
    this.renderCalendar();
    this.updateNotesList();
  }
  previousMonth() {
    this.closeHeaderSelector();
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.yearSelectorCenter = this.currentDate.getFullYear();
    this.renderHeader();
    this.renderCalendar();
    this.updateNotesList();
  }
  nextMonth() {
    this.closeHeaderSelector();
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.yearSelectorCenter = this.currentDate.getFullYear();
    this.renderHeader();
    this.renderCalendar();
    this.updateNotesList();
  }
  renderHeader() {
    if (!this.monthDisplayButton || !this.yearDisplayButton) return;
    this.monthDisplayButton.setText(this.getMonthName(this.currentDate.getMonth()));
    this.yearDisplayButton.setText(String(this.currentDate.getFullYear()));
  }
  openMonthSelector() {
    this.activeHeaderSelector = this.activeHeaderSelector === "month" ? null : "month";
    this.renderHeaderSelector();
  }
  openYearSelector() {
    if (this.activeHeaderSelector === "year") {
      this.closeHeaderSelector();
      return;
    }
    this.yearSelectorCenter = this.currentDate.getFullYear();
    this.activeHeaderSelector = "year";
    this.renderHeaderSelector();
  }
  renderHeaderSelector() {
    if (!this.monthDisplayContainer) return;
    if (this.headerSelectorPopover) {
      this.headerSelectorPopover.remove();
      this.headerSelectorPopover = null;
    }
    if (!this.activeHeaderSelector) return;
    const popover = this.monthDisplayContainer.createDiv("calendar-header-popover");
    popover.onclick = (event) => event.stopPropagation();
    this.headerSelectorPopover = popover;
    if (this.activeHeaderSelector === "month") {
      this.renderMonthSelector(popover);
      return;
    }
    this.renderYearSelector(popover);
  }
  renderMonthSelector(popover) {
    const grid = popover.createDiv("calendar-header-selector-grid");
    this.getMonthNames().forEach((month, index) => {
      const button = grid.createEl("button", {
        cls: "calendar-header-selector-option",
        text: month
      });
      button.type = "button";
      if (index === this.currentDate.getMonth()) {
        button.addClass("is-selected");
      }
      button.onclick = () => {
        this.currentDate = new Date(this.currentDate.getFullYear(), index, 1);
        this.renderHeader();
        this.renderCalendar();
        this.updateNotesList();
        this.closeHeaderSelector();
      };
    });
  }
  renderYearSelector(popover) {
    const nav = popover.createDiv("calendar-header-selector-nav");
    const previousButton = nav.createEl("button", {
      cls: "calendar-header-selector-nav-button",
      text: "\u2190"
    });
    previousButton.type = "button";
    previousButton.onclick = () => {
      this.yearSelectorCenter -= 9;
      this.renderHeaderSelector();
    };
    const rangeLabel = nav.createDiv("calendar-header-selector-range");
    rangeLabel.setText(`${this.yearSelectorCenter - 4} - ${this.yearSelectorCenter + 4}`);
    const nextButton = nav.createEl("button", {
      cls: "calendar-header-selector-nav-button",
      text: "\u2192"
    });
    nextButton.type = "button";
    nextButton.onclick = () => {
      this.yearSelectorCenter += 9;
      this.renderHeaderSelector();
    };
    const grid = popover.createDiv("calendar-header-selector-grid");
    for (let year = this.yearSelectorCenter - 4; year <= this.yearSelectorCenter + 4; year++) {
      const button = grid.createEl("button", {
        cls: "calendar-header-selector-option",
        text: String(year)
      });
      button.type = "button";
      if (year === this.currentDate.getFullYear()) {
        button.addClass("is-selected");
      }
      button.onclick = () => {
        this.currentDate = new Date(year, this.currentDate.getMonth(), 1);
        this.renderHeader();
        this.renderCalendar();
        this.updateNotesList();
        this.closeHeaderSelector();
      };
    }
  }
  closeHeaderSelector() {
    this.activeHeaderSelector = null;
    if (!this.headerSelectorPopover) return;
    this.headerSelectorPopover.remove();
    this.headerSelectorPopover = null;
  }
  updateNotesList() {
    if (!this.notesContainer || !this.selectedDate && !this.selectedWeekStart) {
      if (this.notesContainer) {
        this.notesContainer.empty();
        const emptyMsg = this.notesContainer.createDiv("calendar-notes-empty");
        emptyMsg.setText("Select a date or week to view notes");
      }
      return;
    }
    this.notesContainer.empty();
    const notes = this.selectedWeekStart ? this.getNotesForWeek(this.selectedWeekStart) : this.getNotesForDate(this.selectedDate);
    if (notes.length === 0) {
      const emptyMsg = this.notesContainer.createDiv("calendar-notes-empty");
      emptyMsg.setText(
        this.selectedWeekStart ? `No notes for ${this.getWeekLabel(this.selectedWeekStart)}` : `No notes for ${this.formatDate(this.selectedDate)}`
      );
      return;
    }
    const notesList = this.notesContainer.createDiv("calendar-notes-list");
    notes.forEach((note) => {
      const noteItem = notesList.createDiv("calendar-note-item");
      noteItem.onclick = () => {
        this.app.workspace.getLeaf(false).openFile(note);
      };
      if (this.plugin.settings.showTime) {
        const createdTime = new Date(note.stat.ctime);
        const timeEl = noteItem.createDiv("calendar-note-time");
        timeEl.setText(formatDateTime(createdTime, this.plugin.settings.timeIsoDisplay));
      }
      const noteLink = noteItem.createEl("a", { cls: "calendar-note-name" });
      noteLink.href = "#";
      noteLink.setText(note.basename || note.name);
      noteLink.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.app.workspace.getLeaf(false).openFile(note);
      };
      if (this.plugin.settings.showExcerpt) {
        const excerptEl = noteItem.createDiv("calendar-note-excerpt");
        excerptEl.style.setProperty("line-clamp", String(this.plugin.settings.excerptLines));
        excerptEl.style.setProperty("-webkit-line-clamp", String(this.plugin.settings.excerptLines));
        excerptEl.setText("...");
        this.app.vault.cachedRead(note).then((content) => {
          const text = content.replace(/^---[\s\S]*?---\n?/, "").replace(/#+\s+.*/g, "").replace(/[*_`\[\]]/g, "").replace(/\s+/g, " ").trim();
          excerptEl.setText(text || "\u2014");
        }).catch(() => excerptEl.setText("\u2014"));
      }
    });
  }
  getNotesForDate(date) {
    const notes = [];
    this.app.vault.getMarkdownFiles().forEach((file) => {
      if (this.isNoteCreatedOnDate(file, date)) {
        notes.push(file);
      }
    });
    return this.sortNotes(notes);
  }
  getNotesForWeek(weekStartDate) {
    const notes = [];
    this.app.vault.getMarkdownFiles().forEach((file) => {
      if (this.isNoteCreatedInWeek(file, weekStartDate)) {
        notes.push(file);
      }
    });
    return this.sortNotes(notes);
  }
  sortNotes(notes) {
    const direction = this.plugin.settings.noteSortOrder === "ascending" ? 1 : -1;
    return notes.sort((left, right) => {
      if (this.plugin.settings.noteSortBy === "creation-time") {
        const timeDifference = left.stat.ctime - right.stat.ctime;
        if (timeDifference !== 0) {
          return timeDifference * direction;
        }
      }
      const nameDifference = left.basename.localeCompare(right.basename);
      if (nameDifference !== 0) {
        return nameDifference * direction;
      }
      return (left.stat.ctime - right.stat.ctime) * direction;
    });
  }
  countNotesForDate(date) {
    return this.app.vault.getMarkdownFiles().filter(
      (file) => this.isNoteCreatedOnDate(file, date)
    ).length;
  }
  getDashCount(noteCount) {
    const { dashOneThreshold, dashTwoThreshold, dashThreeThreshold } = this.plugin.settings;
    if (noteCount >= dashThreeThreshold) return 3;
    if (noteCount >= dashTwoThreshold) return 2;
    if (noteCount >= dashOneThreshold) return 1;
    return 0;
  }
  isNoteCreatedOnDate(file, date) {
    const fileDate = new Date(file.stat.ctime);
    return this.isSameDay(fileDate, date);
  }
  isNoteCreatedInWeek(file, weekStartDate) {
    const fileDate = new Date(file.stat.ctime);
    return this.isDateInWeek(fileDate, weekStartDate);
  }
  isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
  }
  formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  getQuarterLabel(date) {
    return `Q${Math.floor(date.getMonth() / 3) + 1}`;
  }
  getCalendarRowStartDate(year, month, week, firstDayOffset) {
    return new Date(year, month, week * 7 - firstDayOffset + 1);
  }
  getWeekEndDate(weekStartDate) {
    return new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), weekStartDate.getDate() + 6);
  }
  isDateInWeek(date, weekStartDate) {
    const weekEndDate = this.getWeekEndDate(weekStartDate);
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const normalizedStart = new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), weekStartDate.getDate()).getTime();
    const normalizedEnd = new Date(weekEndDate.getFullYear(), weekEndDate.getMonth(), weekEndDate.getDate()).getTime();
    return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
  }
  getWeekLabel(weekStartDate) {
    const weekEndDate = this.getWeekEndDate(weekStartDate);
    return `week ${this.getWeekNumberForRow(weekStartDate)} (${this.formatDate(weekStartDate)} to ${this.formatDate(weekEndDate)})`;
  }
  getMonthName(month) {
    return this.getMonthNames()[month] ?? "";
  }
  getMonthNames() {
    return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
  }
};

// main.ts
var CalendarPlugin = class extends import_obsidian3.Plugin {
  async onload() {
    console.log("Loading Obsidian Calendar Plugin");
    await this.loadSettings();
    this.registerView(
      VIEW_TYPE_CALENDAR,
      (leaf) => new CalendarView(leaf, this)
    );
    this.addSettingTab(new CalendarSettingTab(this.app, this));
    this.addRibbonIcon("calendar-glyph", "Open Calendar", async () => {
      await this.activateView();
    });
    this.addCommand({
      id: "open-calendar",
      name: "Open Calendar View",
      callback: async () => {
        await this.activateView();
      }
    });
    this.app.workspace.onLayoutReady(() => {
      this.activateView();
    });
  }
  onunload() {
    console.log("Unloading Obsidian Calendar Plugin");
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_CALENDAR);
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.settings.timeIsoDisplay = normalizeTimeDisplayFormat(this.settings.timeIsoDisplay ?? "");
    this.settings.excerptLines = normalizeExcerptLines(this.settings.excerptLines ?? DEFAULT_SETTINGS.excerptLines);
    this.settings.noteSortBy = normalizeNoteSortBy(this.settings.noteSortBy ?? "");
    this.settings.noteSortOrder = normalizeSortOrder(this.settings.noteSortOrder ?? "");
    this.settings.weekNumberDisplay = normalizeWeekNumberDisplay(this.settings.weekNumberDisplay ?? "");
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  refreshCalendarView() {
    this.app.workspace.getLeavesOfType(VIEW_TYPE_CALENDAR).forEach((leaf) => {
      if (leaf.view instanceof CalendarView) {
        leaf.view.refresh();
      }
    });
  }
  async activateView() {
    try {
      const { workspace } = this.app;
      let leaf = null;
      const leaves = workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);
      if (leaves.length > 0) {
        leaf = leaves[0];
      } else {
        leaf = workspace.getRightLeaf(false);
        if (leaf) {
          await leaf.setViewState({ type: VIEW_TYPE_CALENDAR, active: true });
        }
      }
      if (leaf) {
        workspace.revealLeaf(leaf);
      }
    } catch (error) {
      console.error("Failed to activate calendar view:", error);
    }
  }
};
//# sourceMappingURL=main.js.map
