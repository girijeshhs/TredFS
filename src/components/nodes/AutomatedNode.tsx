import { Handle, Position, type NodeProps } from "reactflow";

import type { AutomatedNodeData } from "@/store/types";

export default function AutomatedNode({ data }: NodeProps<AutomatedNodeData>) {
  const title = data.title.trim() || "Automated Step";

  return (
    <div className="rounded-md border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm text-cyan-950 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-cyan-700">
        Automated
      </div>
      <div className="font-medium">{title}</div>
      <div className="mt-1 text-[11px] text-cyan-700">
        {data.actionId || "No action selected"}
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
