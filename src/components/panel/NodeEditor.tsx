"use client";

import ApprovalForm from "@/components/forms/ApprovalForm";
import AutomatedForm from "@/components/forms/AutomatedForm";
import EndForm from "@/components/forms/EndForm";
import StartForm from "@/components/forms/StartForm";
import TaskForm from "@/components/forms/TaskForm";
import type {
  NodeType,
  WorkflowNode,
  WorkflowNodeByType,
  WorkflowNodeData,
} from "@/store/types";
import { useWorkflowStore } from "@/store/workflowStore";

const formMap: Record<
  NodeType,
  (
    node: WorkflowNode,
    onChange: (id: string, data: Partial<WorkflowNodeData>) => void
  ) => React.ReactNode
> = {
  start: (node, onChange) => (
    <StartForm
      nodeId={node.id}
      data={(node as WorkflowNodeByType["start"]).data}
      onChange={onChange}
    />
  ),
  task: (node, onChange) => (
    <TaskForm
      nodeId={node.id}
      data={(node as WorkflowNodeByType["task"]).data}
      onChange={onChange}
    />
  ),
  approval: (node, onChange) => (
    <ApprovalForm
      nodeId={node.id}
      data={(node as WorkflowNodeByType["approval"]).data}
      onChange={onChange}
    />
  ),
  automated: (node, onChange) => (
    <AutomatedForm
      nodeId={node.id}
      data={(node as WorkflowNodeByType["automated"]).data}
      onChange={onChange}
    />
  ),
  end: (node, onChange) => (
    <EndForm
      nodeId={node.id}
      data={(node as WorkflowNodeByType["end"]).data}
      onChange={onChange}
    />
  ),
};

export default function NodeEditor() {
  const selectedNode = useWorkflowStore((state) => state.selectedNode);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  if (!selectedNode) {
    return null;
  }

  const typeLabel =
    selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1);

  const content = formMap[selectedNode.type](selectedNode, updateNodeData);

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
      <div className="mt-4 border-t border-zinc-200 pt-4">
        <button
          type="button"
          onClick={() => deleteNode(selectedNode.id)}
          className="w-full rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
        >
          Delete Node
        </button>
      </div>
    </aside>
  );
}
