"use client";

import { useCallback, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  type Connection,
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
  const { project } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

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

      setSelectedNode(node as WorkflowNode);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = getDraggedNodeType(event.dataTransfer);
      if (!nodeType || !reactFlowWrapper.current) {
        return;
      }

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      createNode(nodeType, position);
    },
    [createNode, project]
  );

  return (
    <div
      ref={reactFlowWrapper}
      className="h-full w-full"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        className="h-full w-full"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      />
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
