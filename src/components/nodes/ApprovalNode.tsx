import { Handle, Position, type NodeProps } from "reactflow";

import type { ApprovalNodeData } from "@/store/types";

export default function ApprovalNode({ data }: NodeProps<ApprovalNodeData>) {
  const title = data.title || data.label || "Approval";

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
        Approval
      </div>
      <div className="font-medium">{title}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
