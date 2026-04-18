'use client';

import { useCallback } from "react";

import ApprovalForm from "@/components/forms/ApprovalForm";
import TaskForm from "@/components/forms/TaskForm";
import type { ApprovalNodeData, TaskNodeData } from "@/store/types";
import { useWorkflowStore } from "@/store/workflowStore";

export default function NodeEditor() {
  const selectedNode = useWorkflowStore((state) => state.selectedNode);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const updateTaskData = useCallback(
    (id: string, newData: Partial<TaskNodeData>) =>
      updateNodeData(id, newData),
    [updateNodeData]
  );

  const updateApprovalData = useCallback(
    (id: string, newData: Partial<ApprovalNodeData>) =>
      updateNodeData(id, newData),
    [updateNodeData]
  );

  if (!selectedNode) {
    return null;
  }

  const typeLabel =
    selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1);

  let content: React.ReactNode;

  switch (selectedNode.type) {
    case "task":
      content = (
        <TaskForm
          nodeId={selectedNode.id}
          data={selectedNode.data}
          onChange={updateTaskData}
        />
      );
      break;
    case "approval":
      content = (
        <ApprovalForm
          nodeId={selectedNode.id}
          data={selectedNode.data}
          onChange={updateApprovalData}
        />
      );
      break;
    default:
      content = (
        <p className="text-sm text-zinc-500">No editable fields.</p>
      );
  }

  return (
    <aside className="h-full w-80 border-l border-zinc-200 bg-white p-4">
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Node Editor
        </div>
        <div className="text-sm font-semibold text-zinc-900">{typeLabel}</div>
        <div className="text-xs text-zinc-500">{selectedNode.id}</div>
      </div>
      {content}
    </aside>
  );
}
