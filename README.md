# FlowCraft

A fully functional Linear-style task management application built with React, TypeScript, and modern web technologies.

## Features

### Issue Management
- ✅ Create new issues with auto-generated IDs (TSK-001 format)
- ✅ Edit issues with inline editing
- ✅ Delete issues with confirmation
- ✅ Full form validation and error handling
- ✅ Real-time state updates

### Sprint Lifecycle Management
- ✅ Create sprints with name and date ranges
- ✅ Start sprints (changes status from Planned to Active)
- ✅ End sprints (moves status to Completed, returns unfinished issues to backlog)
- ✅ Only one active sprint allowed at a time
- ✅ Edge case handling (can't delete active sprints)

### Three Navigation Views
- **Issues View**: Sortable, filterable list of all issues
- **Current Sprint View**: Kanban board with drag-and-drop functionality
- **Sprints View**: Sprint management with lifecycle controls

### Issue Assignment
- ✅ Assign backlog issues to planned or active sprints
- ✅ Remove issues from sprints back to backlog
- ✅ Visual indicators for sprint assignments
- ✅ Immediate updates across all views

### Drag and Drop Kanban
- ✅ Fully functional drag-and-drop using react-beautiful-dnd
- ✅ Four columns: Todo, In Progress, In Review, Done
- ✅ Real-time status updates
- ✅ Only active sprint issues displayed

### Data Management
- ✅ 18 sample issues with realistic data
- ✅ 3 sprints (completed, active, planned)
- ✅ P0-P5 priority system with color coding
- ✅ Multiple assignees and statuses

### Technical Features
- ✅ Light/Dark mode toggle
- ✅ Voice search for accessibility
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Responsive design
- ✅ Clean, Linear-inspired UI

## Installation

### Prerequisites
- Node.js 16+ and npm/yarn/pnpm

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd FlowCraft
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating Issues
1. Navigate to the **Issues** view
2. Click **New Issue**
3. Fill in the required fields (Title and Assignee are required)
4. Select priority (P0-P5)
5. Click **Create Issue**

### Managing Sprints
1. Navigate to the **Sprints** view
2. Click **New Sprint** to create a sprint
3. Enter sprint name, start date, and end date
4. Click **Create Sprint**
5. Use the **Play** button to start a planned sprint
6. Use the **Stop** button to end an active sprint
7. Delete non-active sprints with the **Trash** icon

### Working with the Kanban Board
1. Navigate to **Current Sprint** view (requires an active sprint)
2. Drag and drop issues between columns:
   - Todo
   - In Progress
   - In Review
   - Done
3. Issues automatically update status when moved

### Filtering and Sorting
- Use the search box to find issues by title, description, ID, or assignee
- Filter by priority, status, or sprint
- Click column headers to sort (ID, Title, Priority, Status, Assignee)

### Assigning Issues to Sprints
- In the Issues view, use the Sprint dropdown on each issue
- Select a sprint or choose "Backlog" to remove from sprint
- Only planned or active sprints can have issues assigned

### Accessibility Features
- **Dark Mode**: Click the sun/moon icon in the header
- **Voice Search**: Click the microphone icon and say:
  - "show issues" or "issues view"
  - "show sprint" or "current sprint"
  - "show sprints" or "sprints view"
  - "dark mode" or "toggle theme"
- **Keyboard Navigation**: Tab through interactive elements
- **Screen Readers**: Full ARIA labels and semantic HTML

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **react-beautiful-dnd** - Drag and drop functionality
- **lucide-react** - Icon library

## Project Structure

```
FlowCraft/
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Navigation and theme toggle
│   │   ├── IssuesView.tsx      # Issues list with CRUD operations
│   │   ├── KanbanView.tsx      # Drag-and-drop kanban board
│   │   └── SprintsView.tsx     # Sprint management
│   ├── App.tsx                 # Main app with state management
│   ├── App.css                 # Comprehensive styling
│   ├── data.ts                 # Sample data
│   ├── types.ts                # TypeScript interfaces
│   ├── utils.ts                # Helper functions
│   └── main.tsx                # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Features Checklist

- [x] Issue creation with auto-generated IDs
- [x] Issue editing (inline and modal)
- [x] Issue deletion with confirmation
- [x] Full form validation
- [x] Sprint creation with validation
- [x] Sprint start (with single active sprint validation)
- [x] Sprint end (with backlog return for unfinished issues)
- [x] Sprint deletion (with active sprint protection)
- [x] Issues view with sorting and filtering
- [x] Current Sprint kanban view
- [x] Sprints management view
- [x] Issue assignment to sprints
- [x] Drag and drop kanban
- [x] Priority system (P0-P5) with colors
- [x] Light/Dark mode
- [x] Voice search
- [x] Accessibility (WCAG 2.1 AA)
- [x] Responsive design
- [x] 18 sample issues
- [x] 3 sample sprints

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Note: Voice search requires Chrome or Edge (WebKit Speech Recognition API).

## License

MIT

## Contributing

This is a demonstration project. Feel free to fork and modify for your own use.
