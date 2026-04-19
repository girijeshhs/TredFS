'use client';

import type { NodeType } from "@/store/types";
import { NODE_DRAG_TYPE } from "@/utils/dragAndDrop";

const paletteItems: Array<{ type: NodeType; label: string }> = [
  { type: "start", label: "Start" },
  { type: "task", label: "Task" },
  { type: "approval", label: "Approval" },
  { type: "automated", label: "Automated Step" },
  { type: "end", label: "End" },
];

export default function NodePalette() {
  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: NodeType
  ) => {
    event.dataTransfer.setData(NODE_DRAG_TYPE, nodeType);
    event.dataTransfer.setData("text/plain", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="h-full w-56 border-r border-zinc-200 bg-white p-4">
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Node Palette
        </div>
        <div className="text-sm font-semibold text-zinc-900">
          Drag to canvas
        </div>
      </div>
      <div className="space-y-2">
        {paletteItems.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(event) => handleDragStart(event, item.type)}
            className="cursor-grab rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm"
          >
            {item.label}
          </div>
        ))}
      </div>
    </aside>
  );
}
