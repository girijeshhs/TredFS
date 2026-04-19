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

const mergeNodeData = (
  node: WorkflowNode,
  newData: Partial<WorkflowNodeData>
): WorkflowNode =>
  ({
    ...node,
    data: normalizeNodeData(node.type, {
      ...node.data,
      ...newData,
    } as Partial<WorkflowNodeData>),
  }) as WorkflowNode;

const normalizeSelectedNode = (
  nodes: WorkflowNode[],
  selectedNode: WorkflowNode | null
): WorkflowNode | null => {
  if (!selectedNode) {
    return null;
  }

  const selected = nodes.find((node) => node.id === selectedNode.id) ?? null;
  return selected ? normalizeNode(selected) : null;
};

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  setNodes: (nodes: WorkflowNode[]) =>
    set((state) => {
      const normalized = nodes.map(normalizeNode);

      return {
        nodes: normalized,
        selectedNode: normalizeSelectedNode(normalized, state.selectedNode),
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
        node.id === id ? mergeNodeData(node, newData) : node
      );

      return {
        nodes,
        selectedNode: normalizeSelectedNode(nodes, state.selectedNode),
      };
    }),
  deleteNode: (id: string) =>
    set((state) => {
      const nodes = state.nodes.filter((node) => node.id !== id);
      const edges = state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      );

      return {
        nodes,
        edges,
        selectedNode: normalizeSelectedNode(nodes, state.selectedNode),
      };
    }),
}));
