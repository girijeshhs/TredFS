import { Handle, Position, type NodeProps } from "reactflow";

import type { TaskNodeData } from "@/store/types";

export default function TaskNode({ data }: NodeProps<TaskNodeData>) {
  const title = data.title || data.label || "Task";

  return (
    <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-950 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
        Task
      </div>
      <div className="font-medium">{title}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
