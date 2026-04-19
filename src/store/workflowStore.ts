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

const syncSelectedEdge = (
  edges: WorkflowEdge[],
  selectedEdgeId: string | null
): string | null => {
  if (!selectedEdgeId) {
    return null;
  }

  const match = edges.some((edge) => edge.id === selectedEdgeId);
  return match ? selectedEdgeId : null;
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdgeId: null,
  setNodes: (nodes: WorkflowNode[]) =>
    set((state) => {
      const normalized = nodes.map(normalizeNode);
      return {
        nodes: normalized,
        selectedNode: syncSelectedNode(normalized, state.selectedNode),
      };
    }),
  setEdges: (edges: WorkflowEdge[]) =>
    set((state) => ({
      edges,
      selectedEdgeId: syncSelectedEdge(edges, state.selectedEdgeId),
    })),
  setSelectedNode: (node: WorkflowNode | null) =>
    set((state) => ({
      selectedNode: node ? normalizeNode(node) : null,
      selectedEdgeId: node ? null : state.selectedEdgeId,
    })),
  setSelectedEdge: (edgeId: string | null) =>
    set((state) => ({
      selectedEdgeId: edgeId,
      selectedNode: edgeId ? null : state.selectedNode,
    })),
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
        selectedEdgeId: null,
      };
    }),
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
  deleteNode: (id: string) =>
    set((state) => {
      const nodes = state.nodes.filter((node) => node.id !== id);
      const edges = state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      );

      return {
        nodes,
        edges,
        selectedNode: syncSelectedNode(nodes, state.selectedNode),
        selectedEdgeId: syncSelectedEdge(edges, state.selectedEdgeId),
      };
    }),
  deleteEdge: (id: string) =>
    set((state) => {
      const edges = state.edges.filter((edge) => edge.id !== id);

      return {
        edges,
        selectedEdgeId: syncSelectedEdge(edges, state.selectedEdgeId),
      };
    }),
  deleteSelection: () => {
    const { selectedEdgeId, selectedNode, deleteEdge, deleteNode } = get();

    if (selectedEdgeId) {
      deleteEdge(selectedEdgeId);
      return;
    }

    if (selectedNode) {
      deleteNode(selectedNode.id);
    }
  },
}));
