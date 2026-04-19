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

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  setNodes: (nodes: WorkflowNode[]) =>
    set((state) => {
      const normalized = nodes.map(normalizeNode);
      const selected = state.selectedNode
        ? normalized.find((node) => node.id === state.selectedNode?.id) ?? null
        : null;

      return {
        nodes: normalized,
        selectedNode: selected ? normalizeNode(selected) : null,
      };
    }),
  setEdges: (edges: WorkflowEdge[]) => set({ edges }),
  setSelectedNode: (node: WorkflowNode | null) =>
    set({ selectedNode: node ? normalizeNode(node) : null }),
  createNode: (type, position) =>
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
  updateNodeData: (id: string, newData: Partial<WorkflowNodeData>) =>
    set((state) => {
      const nodes = state.nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: normalizeNodeData(node.type, {
                ...node.data,
                ...newData,
              }),
            }
          : node
      );

      const selected = state.selectedNode
        ? nodes.find((node) => node.id === state.selectedNode?.id) ?? null
        : null;

      return {
        nodes,
        selectedNode: selected ? normalizeNode(selected) : null,
      };
    }),
  deleteNode: (id: string) =>
    set((state) => {
      const nodes = state.nodes.filter((node) => node.id !== id);
      const edges = state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      );

      const selected = state.selectedNode
        ? nodes.find((node) => node.id === state.selectedNode?.id) ?? null
        : null;

      return {
        nodes,
        edges,
        selectedNode: selected ? normalizeNode(selected) : null,
      };
    }),
}));
