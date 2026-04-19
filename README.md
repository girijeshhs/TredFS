# HR Workflow Designer
A visual HR process builder to design, configure, and simulate internal workflows.

## Overview
- Builds HR workflows on a React Flow canvas using Start, Task, Approval, Automated, and End nodes.
- Supports node configuration through a side-panel form system and execution testing through a simulation panel.
- Solves the need to quickly model and validate workflow logic (onboarding, approvals, document steps) without backend dependencies.

## Architecture

### Canvas Layer
- Renders nodes and edges using React Flow.
- Supports drag-and-drop node creation, edge connections, selection, and delete interactions.
- Handles interaction events and delegates state updates to the store.

### State Layer
- Zustand is the central source of truth for nodes, edges, and selected node/edge.
- Exposes mutation actions for create, update, delete, and select operations.

### Component Layer
- Node components: Start, Task, Approval, Automated, End.
- Form components: type-specific controlled editors with dynamic key-value fields.
- Panel components: node palette, node editor, workflow runner.
- Workflow import/export is handled in the UI layer with client-side JSON validation before state updates.

### Utils Layer
- Contains pure simulation and validation logic (graph traversal plus warning generation).
- Normalizes node defaults and data shape for consistent typed state.

### API Layer
- `GET /api/automations` returns mock automated actions.
- `POST /api/simulate` accepts workflow JSON and returns steps and warnings.
- Frontend calls routes through an API module; import/export remains in the UI layer and API logic stays separate.

## How to Run

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Usage

- Drag nodes from the palette onto the canvas.
- Connect nodes by linking source/target handles.
- Select a node and edit fields in the Node Editor panel.
- Run workflow simulation from the runner panel to view execution steps and warnings.
- Export the current workflow as a JSON file.
- Import workflows from JSON files with structure validation.
- Use the MiniMap to navigate larger workflow graphs.

## Design Decisions

### Why Zustand
- Lightweight, low-boilerplate state management suited to interaction-heavy graph editing.

### Why Logic Is Separated Into Utils
- Keeps simulation and validation pure and reusable across UI and API routes.
- Improves testability and maintainability.

### Why a Minimal UI Approach
- Prioritizes assignment scope, architectural clarity, and functional completeness over visual polish.

## Completed Implementation

### Workflow Canvas
- Drag-and-drop node creation, edge connections, node/edge selection, and deletion.
- MiniMap for visual workflow graph overview.
- Empty-state messaging to guide users when the canvas is empty.
- Auto-selection of newly created nodes for immediate editing.

### All Node Types
- Start, Task, Approval, Automated, End.

### Dynamic Node Forms
- Start: title and metadata key-value pairs.
- Task: required title, description, assignee, due date, custom key-value pairs.
- Approval: title, approver role, threshold.
- Automated: title, action selection, dynamic action parameters.
- End: message and summary flag.

### Workflow Simulation
- Async simulation execution via API with step-by-step textual output.
- Export workflow as a JSON download from the runner panel.
- Import workflow from JSON with client-side validation.

### Validation Rules
- Missing start node.
- Multiple start nodes.
- Start node with incoming edges.
- Cycles.
- Disconnected nodes.
- Invalid edge targets.
- Multiple outgoing edge warning.

### Mock API Routes
- `GET /api/automations`
- `POST /api/simulate`

## Future Improvements

- Better UI polish:
  - Richer node visuals, interaction polish, and a stronger accessibility pass.
- Persistence (save/load workflows):
  - No local or backend persistence yet.
- Undo/redo:
  - State history is not implemented.
- Advanced validation constraints:
  - No strict authoring-time enforcement (warnings are simulation-time).
  - No deep rule engine for business-specific constraints.
- Simplifications made:
  - Simulation uses deterministic linear traversal (first outgoing edge when multiple exist).
