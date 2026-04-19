"use client";

import ApprovalForm from "@/components/forms/ApprovalForm";
import AutomatedForm from "@/components/forms/AutomatedForm";
import TaskForm from "@/components/forms/TaskForm";
import type { WorkflowNode, WorkflowNodeByType, WorkflowNodeData } from "@/store/types";
import { useWorkflowStore } from "@/store/workflowStore";

type EditableNode =
  | WorkflowNodeByType["task"]
  | WorkflowNodeByType["approval"]
  | WorkflowNodeByType["automated"];

type EditableNodeType = EditableNode["type"];

const isEditableNode = (node: WorkflowNode): node is EditableNode =>
  node.type === "task" ||
  node.type === "approval" ||
  node.type === "automated";

const formRenderers: Record<
  EditableNodeType,
  (
    node: WorkflowNodeByType[EditableNodeType],
    onChange: (id: string, data: Partial<WorkflowNodeData>) => void
  ) => React.ReactNode
> = {
  task: (node, onChange) => (
    <TaskForm
      nodeId={node.id}
      data={node.data as WorkflowNodeByType["task"]["data"]}
      onChange={onChange}
    />
  ),
  approval: (node, onChange) => (
    <ApprovalForm
      nodeId={node.id}
      data={node.data as WorkflowNodeByType["approval"]["data"]}
      onChange={onChange}
    />
  ),
  automated: (node, onChange) => (
    <AutomatedForm
      nodeId={node.id}
      data={node.data as WorkflowNodeByType["automated"]["data"]}
      onChange={onChange}
    />
  ),
};

export default function NodeEditor() {
  const selectedNode = useWorkflowStore((state) => state.selectedNode);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  if (!selectedNode) {
    return null;
  }

  const typeLabel =
    selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1);

  const content = isEditableNode(selectedNode)
    ? formRenderers[selectedNode.type](selectedNode, updateNodeData)
    : (
        <p className="text-sm text-zinc-500">No editable fields.</p>
      );

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
