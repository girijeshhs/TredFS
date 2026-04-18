import { Handle, Position, type NodeProps } from "reactflow";

import type { StartNodeData } from "@/store/types";

export default function StartNode({ data }: NodeProps<StartNodeData>) {
  const label = data.label || "Start";

  return (
    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-950 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
        Start
      </div>
      <div className="font-medium">{label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
