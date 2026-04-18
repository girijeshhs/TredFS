import { addEdge, applyEdgeChanges, applyNodeChanges } from "reactflow";
import { create } from "zustand";

import { createNodeId } from "@/utils/ids";
import {
  createWorkflowNode,
  normalizeNode,
  normalizeNodeData,
} from "@/utils/nodeDefaults";
import type {
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeData,
  WorkflowState,
} from "./types";

const syncSelectedNode = (
  nodes: WorkflowNode[],
  selectedNode: WorkflowNode | null
): WorkflowNode | null => {
  if (!selectedNode) {
    return null;
  }

  const match = nodes.find((node) => node.id === selectedNode.id);
  return match ? normalizeNode(match) : null;
};

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  simulationSteps: [],
  simulationWarnings: [],
  setNodes: (nodes: WorkflowNode[]) =>
    set((state) => {
      const normalized = nodes.map(normalizeNode);
      return {
        nodes: normalized,
        selectedNode: syncSelectedNode(normalized, state.selectedNode),
      };
    }),
  setEdges: (edges: WorkflowEdge[]) => set({ edges }),
  setSelectedNode: (node: WorkflowNode | null) =>
    set({ selectedNode: node ? normalizeNode(node) : null }),
  addNode: (type, position) =>
    set((state) => {
      const newNode = createWorkflowNode({
        id: createNodeId(),
        type,
        position,
      });
      const nodes = [...state.nodes, newNode];

      return {
        nodes,
        selectedNode: newNode,
      };
    }),
  applyNodeChanges: (changes) =>
    set((state) => {
      const updated = applyNodeChanges(changes, state.nodes).map(normalizeNode);
      return {
        nodes: updated,
        selectedNode: syncSelectedNode(updated, state.selectedNode),
      };
    }),
  applyEdgeChanges: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
  addConnection: (connection) =>
    set((state) => ({ edges: addEdge(connection, state.edges) })),
  updateNodeData: (id: string, newData: Partial<WorkflowNodeData>) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: normalizeNodeData(node.type, {
                ...node.data,
                ...newData,
              }),
            }
          : node
      ),
      selectedNode:
        state.selectedNode?.id === id
          ? {
              ...state.selectedNode,
              data: normalizeNodeData(state.selectedNode.type, {
                ...state.selectedNode.data,
                ...newData,
              }),
            }
          : state.selectedNode,
    })),
  setSimulationResult: (result) =>
    set({
      simulationSteps: result.steps,
      simulationWarnings: result.warnings,
    }),
}));
