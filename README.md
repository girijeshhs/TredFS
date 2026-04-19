# HR Workflow Designer

A React Flow based visual editor for building and simulating HR process workflows.

## Overview

This project provides a browser-based workflow design experience where users can compose HR flows using typed nodes (`Start`, `Task`, `Approval`, `End`), connect them on a canvas, configure node metadata, and run a deterministic simulation.

It was built to offer a lightweight internal tool for modeling approval and task routing logic without introducing backend complexity, while still enforcing basic workflow correctness checks.

## Features

- Drag-and-drop node creation from a left-side node palette onto the React Flow canvas.
- Node editing panel for `Task` and `Approval` nodes:
- `Task`: title, description, assignee.
- `Approval`: title, approver role, threshold.
- Workflow simulation runner that traverses from `Start` and produces ordered execution steps.
- Validation and safety warnings during simulation:
- Missing start node blocks execution.
- Multiple start nodes detected (first start node is used).
- Disconnected nodes reported.
- Additional runtime warnings for cycles, missing edge targets, and multi-outgoing branches (first edge used).

## Architecture

- Canvas (React Flow)
- `WorkflowCanvas` hosts the flow surface, applies node/edge changes, supports connections, and handles drag-drop placement via projected coordinates.
- Custom node renderers (`StartNode`, `TaskNode`, `ApprovalNode`, `EndNode`) are registered through a `nodeTypes` map.

- Store (Zustand)
- Central state in `workflowStore` manages `nodes`, `edges`, and `selectedNode`.
- Store actions cover node creation, node/edge updates, selection sync, and typed node data updates.
- Node data is normalized through shared defaults to keep shape consistency across edits.

- Components (nodes, forms, panel)
- `NodePalette` exposes draggable node types.
- `NodeEditor` conditionally renders typed forms (`TaskForm`, `ApprovalForm`) based on selected node.
- `WorkflowRunner` executes simulation and displays steps plus warnings.
- Layout composition in `src/app/page.tsx`: palette (left), canvas + runner (center), editor (right).

- Utils (simulation + validation)
- `workflowSimulation.ts` contains traversal and validation logic (`hasStartNode`, `simulateWorkflow`).
- Simulation is intentionally linear and deterministic: it follows the first outgoing edge.
- Utility modules also isolate drag-drop transport, node defaults/normalization, and node ID generation.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Zustand
- React Flow
- Tailwind CSS

## How to Run

```bash
npm install
npm run dev
```

Application runs at `http://localhost:3000`.

## Usage

1. Drag nodes from the **Node Palette** into the canvas.
2. Connect nodes by drawing edges from source handles to target handles.
3. Click a `Task` or `Approval` node to edit its fields in the **Node Editor**.
4. Click **Run Workflow** in the simulation panel to execute and inspect:
- Step order.
- Validation warnings (for example: multiple start nodes or disconnected nodes).

## Design Decisions

- Zustand for state management:
- Minimal API surface, low boilerplate, and straightforward co-location of state/actions for an interaction-heavy canvas.

- Utility-first separation of logic:
- Simulation and data normalization are kept outside UI components to make behavior testable and easier to evolve.

- Minimal UI by design:
- Prioritized workflow behavior and correctness over visual complexity to keep implementation focused and maintainable.

## Tradeoffs

- Branch semantics are simplified: when a node has multiple outgoing edges, simulation follows only the first edge.
- No persistence layer: workflows are in-memory and reset on refresh.
- No node/edge deletion UX, undo/redo, or version history in the current implementation.
- Validation is surfaced as runtime warnings in the simulator rather than as hard authoring constraints.

## Future Improvements

- Add node and edge deletion flows with clear affordances.
- Add persistence (local storage and/or backend API) for save/load workflows.
- Improve UI/UX with richer node states, better empty states, and interaction feedback.
