import type { StartNodeData } from "@/store/types";
import { inputClassName, labelClassName } from "./formStyles";

type StartFormProps = {
  nodeId: string;
  data: StartNodeData;
  onChange: (id: string, newData: Partial<StartNodeData>) => void;
};

export default function StartForm({ nodeId, data, onChange }: StartFormProps) {
  const metadataEntries = Object.entries(data.metadata);

  const handleMetadataChange = (
    currentKey: string,
    nextKey: string,
    value: string
  ) => {
    const nextMetadata: Record<string, string> = { ...data.metadata };

    if (currentKey !== nextKey) {
      delete nextMetadata[currentKey];
    }

    nextMetadata[nextKey] = value;

    onChange(nodeId, { metadata: nextMetadata });
  };

  const handleRemoveMetadata = (key: string) => {
    const nextMetadata: Record<string, string> = { ...data.metadata };
    delete nextMetadata[key];
    onChange(nodeId, { metadata: nextMetadata });
  };

  const handleAddMetadata = () => {
    let nextKey = `meta_${metadataEntries.length + 1}`;

    while (nextKey in data.metadata) {
      nextKey = `${nextKey}_new`;
    }

    onChange(nodeId, {
      metadata: {
        ...data.metadata,
        [nextKey]: "",
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClassName} htmlFor="start-title">
          Start Title
        </label>
        <input
          id="start-title"
          className={inputClassName}
          type="text"
          value={data.title}
          onChange={(event) => onChange(nodeId, { title: event.target.value })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={labelClassName}>Metadata</label>
          <button
            type="button"
            onClick={handleAddMetadata}
            className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            Add Metadata
          </button>
        </div>
        {metadataEntries.length === 0 && (
          <p className="text-xs text-zinc-500">No metadata added.</p>
        )}
        {metadataEntries.map(([metaKey, metaValue]) => (
          <div key={metaKey} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <input
              className={inputClassName}
              type="text"
              value={metaKey}
              placeholder="Key"
              onChange={(event) =>
                handleMetadataChange(metaKey, event.target.value, metaValue)
              }
            />
            <input
              className={inputClassName}
              type="text"
              value={metaValue}
              placeholder="Value"
              onChange={(event) =>
                handleMetadataChange(metaKey, metaKey, event.target.value)
              }
            />
            <button
              type="button"
              onClick={() => handleRemoveMetadata(metaKey)}
              className="self-center rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
