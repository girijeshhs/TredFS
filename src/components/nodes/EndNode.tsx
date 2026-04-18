import { Handle, Position, type NodeProps } from "reactflow";

import type { EndNodeData } from "@/store/types";

export default function EndNode({ data }: NodeProps<EndNodeData>) {
  const label = data.label || "End";

  return (
    <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-950 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-rose-700">
        End
      </div>
      <div className="font-medium">{label}</div>
      <Handle type="target" position={Position.Top} />
    </div>
  );
}
