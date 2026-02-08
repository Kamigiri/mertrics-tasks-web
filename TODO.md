# Plan: Google Tasks-style Board with View Presets

Transform the task board into a compact, Google Tasks-inspired layout with customizable list visibility and saved view presets. Add a responsive grid layout (up to 2 rows) with visibility controls in the toolbar, and persist user preferences via backend API.

**Key Decisions:**
- List visibility checkboxes in top toolbar (per user selection)
- Dropdown selector for view presets at top of board
- Responsive grid wrapping (not fixed 2-row layout)
- Frontend-only implementation with backend API specification document
- Local state management with service layer for future backend integration

## Implementation Steps

### 1. Create preferences data models
**File:** `src/app/models/board-preferences.model.ts` (new)

Create TypeScript interfaces:
- `BoardPreferences`: `{ viewPresets: ViewPreset[], activePresetId: string }`
- `ViewPreset`: `{ id: string, name: string, visibleListIds: string[], listOrder: string[] }`
- Export default presets: "All Lists", with examples for Work/After Work modes

### 2. Create preferences service
**File:** `src/app/services/preferences.service.ts` (new)

- Signals for `boardPreferences`, `activePreset`, `visibleLists`
- Methods: `loadPreferences()`, `savePreferences()`, `setActivePreset()`, `toggleListVisibility()`, `createPreset()`, `updatePreset()`, `deletePreset()`
- Use `localStorage` temporarily (keys: `board_preferences`, `active_preset_id`)
- Structure to easily migrate to HTTP calls later

### 3. Update TasksViewComponent
**File:** `src/app/components/tasks/tasks-view.component.ts`

- Inject `PreferencesService`
- Add computed `filteredTaskLists` that filters based on `visibleLists()` signal
- Call `preferences.loadPreferences()` in constructor
- Pass filtered lists to `task-board`

### 4. Create board toolbar component
**Files:** 
- `src/app/components/tasks/task-board/board-toolbar/board-toolbar.component.ts` (new)
- `src/app/components/tasks/task-board/board-toolbar/board-toolbar.component.html` (new)
- `src/app/components/tasks/task-board/board-toolbar/board-toolbar.component.scss` (new)

Component structure:
- Inputs: `allLists: TaskList[]`, `visibleListIds: string[]`, `presets: ViewPreset[]`, `activePresetId: string`
- Outputs: `presetChanged: EventEmitter<string>`, `listVisibilityToggled: EventEmitter<string>`
- Left section: Preset dropdown (MatSelect) showing preset names
- Right section: List visibility checkboxes in a row with list titles
- Use Material checkbox with compact styling

### 5. Redesign TaskBoardComponent layout
**Files:** 
- `src/app/components/tasks/task-board/task-board.ts`
- `src/app/components/tasks/task-board/task-board.html`

Changes:
- Add toolbar at top: `<app-board-toolbar>`
- Replace horizontal scroll with CSS Grid: `display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
- Set max rows visible: wrap grid in container with `max-height` for 2 rows, `overflow-y: auto`
- Calculate row height dynamically based on viewport
- Reduce list width from 320px (`w-80`) to 280px for compactness
- Keep CDK drag-drop but adapt for grid layout (may need custom preview positioning)

### 6. Update board styling
**File:** `src/app/components/tasks/task-board/task-board.css`

Updates:
- Compact spacing: reduce padding, gaps, font sizes
- Grid container: `grid-auto-rows: minmax(400px, 1fr)`
- Calculate 2-row max height: `max-height: calc(2 * 400px + gap)`
- Toolbar: fixed height, flex layout, border-bottom
- Add hover states for checkboxes/dropdown
- Match Google Tasks color scheme: lighter grays, subtle borders

### 7. Compact task-item styling
**File:** `src/app/components/tasks/task-item/task-item.component.scss`

Adjustments:
- Reduce card height, padding (e.g., `py-2` instead of `py-3`)
- Smaller font sizes for task title and metadata
- Tighter checkbox spacing
- Reduce icon button sizes

### 8. Update task list header
**File:** `src/app/components/tasks/task-board/task-board.html`

Changes:
- Reduce header padding from `p-3` to `p-2`
- Smaller font for title and task count badge
- Make controls more compact (already using `scale-75`, ensure consistent)

### 9. Wire up preset management
**File:** `src/app/components/tasks/task-board/task-board.ts`

Integration:
- Handle `(presetChanged)` event: call `preferences.setActivePreset()`
- Handle `(listVisibilityToggled)` event: call `preferences.toggleListVisibility()`, auto-save to storage
- Add buttons/menu for creating/editing/deleting presets (future enhancement noted in plan)

### 10. Create backend API specification
**File:** `docs/backend-api-preferences.md` (new)

Document:
- Required endpoints:
  - `GET /api/preferences/board` - Returns `BoardPreferences`
  - `PUT /api/preferences/board` - Saves `BoardPreferences`, returns updated object
- Request/response schemas with TypeScript interfaces
- Authentication requirements (assumed JWT or session-based)
- Error handling conventions
- Migration notes: how to replace localStorage with HTTP calls in `PreferencesService`

## Verification Steps

- [ ] Navigate to `/tasks/all` board view
- [ ] Check toolbar appears at top with preset dropdown and list checkboxes
- [ ] Toggle list visibility checkboxes - verify lists show/hide immediately
- [ ] Create a test preset with only 2-3 lists visible, verify it persists on refresh
- [ ] Verify grid layout wraps lists into multiple rows responsively
- [ ] Resize window to confirm 2-row max with vertical scroll when needed
- [ ] Check compact styling matches Google Tasks density
- [ ] Verify drag-drop still works for reordering lists and tasks
- [ ] Test on mobile viewport for responsiveness

## Future Enhancements

(Not included in this implementation)
- Preset management UI (create/rename/delete presets via dialog)
- Backend integration (replace localStorage)
- Keyboard shortcuts for switching presets
- Preset sharing between devices
- Animation for list show/hide transitions

---

**Status:** Ready for implementation
**Estimated Complexity:** Medium-High
**Files to Create:** 5 new files
**Files to Modify:** 6 existing files