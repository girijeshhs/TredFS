# HR Workflow Designer
A visual HR process builder to design, configure, and simulate internal workflows.

## 2. Overview
- Builds HR workflows on a React Flow canvas using Start, Task, Approval, Automated, and End nodes.
- Supports node configuration through a side-panel form system and execution testing through a simulation panel.
- Solves the need to quickly model and validate workflow logic (onboarding, approvals, document steps) without backend dependencies.

## 3. Architecture
- Canvas layer (React Flow responsibilities):
	- Renders nodes/edges, supports drag/drop node creation, edge connections, selection, and delete interactions.
	- Handles canvas interactions and delegates state mutations to the store.
- State layer (Zustand responsibilities):
	- Central source of truth for nodes, edges, selected node/edge.
	- Exposes mutation actions for create/update/delete/select operations.
- Component layer (nodes, forms, panels):
	- Node components: Start, Task, Approval, Automated, End.
	- Form components: type-specific editors with controlled inputs and dynamic key-value fields.
	- Panels: node palette, node editor, workflow runner.
- Utils layer (simulation, validation):
	- Pure simulation and validation logic (graph traversal + warning generation).
	- Node data normalization/defaults for consistent typed state.
- API layer (mock routes and purpose):
	- `GET /api/automations` returns mock automated actions.
	- `POST /api/simulate` accepts workflow JSON and returns steps/warnings using simulation utils.
	- Frontend calls routes through an API module; UI does not call simulation utils directly.

## 4. How to Run
```bash
npm install
npm run dev
```
Open: `http://localhost:3000`

## 5. Usage
- Drag nodes from the palette onto the canvas.
- Connect nodes by linking source/target handles.
- Select a node and edit fields in the Node Editor panel.
- Run workflow simulation from the runner panel to view execution steps and warnings.

## 6. Design Decisions
- Why Zustand:
	- Lightweight, low-boilerplate state management suitable for interaction-heavy graph editing.
- Why logic is separated into utils:
	- Keeps simulation/validation pure and reusable across UI and API routes.
	- Improves testability and maintainability.
- Why minimal UI approach:
	- Prioritized assignment scope, architectural clarity, and functional completeness over visual polish.

## 7. Completed Implementation
- Workflow canvas:
	- Drag/drop, connect, select, delete nodes/edges.
- All node types:
	- Start, Task, Approval, Automated, End.
- Dynamic node forms:
	- Start: title + metadata key-values.
	- Task: required title, description, assignee, due date, custom key-values.
	- Approval: title, approver role, threshold.
	- Automated: title, action selection, dynamic action params.
	- End: message + summary flag.
- Workflow simulation:
	- Async simulation execution via API and step-by-step textual output.
- Validation rules:
	- Missing start node, multiple start nodes, start node with incoming edges, cycles, disconnected nodes, invalid edge targets, multiple outgoing edges warning.
- Mock API routes:
	- `GET /api/automations`
	- `POST /api/simulate`

## 8. What is NOT Implemented / Future Work
- Advanced UI/UX improvements:
	- Richer node visuals, interaction polish, stronger accessibility pass.
- Persistence (save/load workflows):
	- No local or backend persistence yet.
- Undo/redo:
	- State history is not implemented.
- Advanced validation constraints:
	- No strict authoring-time enforcement (warnings are simulation-time).
	- No deep rule engine for business-specific constraints.
- Simplifications made:
	- Simulation uses deterministic linear traversal (first outgoing edge when multiple exist).
