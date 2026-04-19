import type { EndNodeData } from "@/store/types";
import { inputClassName, labelClassName } from "./formStyles";

type EndFormProps = {
  nodeId: string;
  data: EndNodeData;
  onChange: (id: string, newData: Partial<EndNodeData>) => void;
};

export default function EndForm({ nodeId, data, onChange }: EndFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClassName} htmlFor="end-message">
          End Message
        </label>
        <input
          id="end-message"
          className={inputClassName}
          type="text"
          value={data.message}
          onChange={(event) => onChange(nodeId, { message: event.target.value })}
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
        <input
          type="checkbox"
          checked={data.summary}
          onChange={(event) => onChange(nodeId, { summary: event.target.checked })}
          className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400"
        />
        Summary Flag
      </label>
    </div>
  );
}
