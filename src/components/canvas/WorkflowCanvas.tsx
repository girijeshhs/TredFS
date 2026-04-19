"use client";

import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  type Connection,
  type EdgeMouseHandler,
  type EdgeChange,
  type NodeChange,
  type NodeMouseHandler,
} from "reactflow";

import nodeTypes from "@/components/nodes/nodeTypes";
import { useWorkflowStore } from "@/store/workflowStore";
import type { WorkflowEdge, WorkflowNode } from "@/store/types";
import { isNodeType } from "@/utils/nodeDefaults";
import { getDraggedNodeType } from "@/utils/dragAndDrop";

function WorkflowCanvasInner() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const setNodes = useWorkflowStore((state) => state.setNodes);
  const setEdges = useWorkflowStore((state) => state.setEdges);
  const createNode = useWorkflowStore((state) => state.createNode);
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);
  const selectedNode = useWorkflowStore((state) => state.selectedNode);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(applyNodeChanges(changes, nodes) as WorkflowNode[]);
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges(applyEdgeChanges(changes, edges) as WorkflowEdge[]);
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges(addEdge(connection, edges));
    },
    [edges, setEdges]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      if (!isNodeType(node.type)) {
        return;
      }

      setSelectedEdgeId(null);
      setSelectedNode(node as WorkflowNode);
    },
    [setSelectedNode]
  );

  const onEdgeClick: EdgeMouseHandler = useCallback(
    (_event, edge) => {
      setSelectedNode(null);
      setSelectedEdgeId(edge.id);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdgeId(null);
  }, [setSelectedNode]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = getDraggedNodeType(event.dataTransfer);
      if (!nodeType) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      createNode(nodeType, position);
    },
    [createNode, screenToFlowPosition]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Delete") {
        return;
      }

      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      const isEditable =
        target?.isContentEditable ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select";

      if (isEditable) {
        return;
      }

      event.preventDefault();

      if (selectedNode) {
        deleteNode(selectedNode.id);
        return;
      }

      if (!selectedEdgeId) {
        return;
      }

      setEdges(edges.filter((edge) => edge.id !== selectedEdgeId));
      setSelectedEdgeId(null);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [deleteNode, edges, selectedEdgeId, selectedNode, setEdges]);

  return (
    <div className="relative h-full w-full" onDrop={onDrop} onDragOver={onDragOver}>
      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
          <p className="max-w-md rounded-md border border-zinc-200 bg-white/90 px-4 py-3 text-sm text-zinc-600 shadow-sm">
            Drag nodes from the palette to start building a workflow
          </p>
        </div>
      )}
      <ReactFlow
        className="h-full w-full"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        deleteKeyCode={null}
        fitView
      >
        <MiniMap
          position="bottom-right"
          nodeColor="#18181b"
          pannable
          zoomable
          className="!border !border-zinc-200 !bg-white"
        />
      </ReactFlow>
    </div>
  );
}

export default function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  );
}
