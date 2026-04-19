import type { TaskNodeData } from "@/store/types";
import { inputClassName, labelClassName } from "./formStyles";

type TaskFormProps = {
  nodeId: string;
  data: TaskNodeData;
  onChange: (id: string, newData: Partial<TaskNodeData>) => void;
};

export default function TaskForm({ nodeId, data, onChange }: TaskFormProps) {
  const { title, description, assignee, dueDate, customFields } = data;

  const customFieldEntries = Object.entries(customFields);

  const handleCustomFieldChange = (
    currentKey: string,
    nextKey: string,
    value: string
  ) => {
    const nextFields: Record<string, string> = { ...customFields };

    if (currentKey !== nextKey) {
      delete nextFields[currentKey];
    }

    nextFields[nextKey] = value;

    onChange(nodeId, { customFields: nextFields });
  };

  const handleRemoveCustomField = (key: string) => {
    const nextFields: Record<string, string> = { ...customFields };
    delete nextFields[key];
    onChange(nodeId, { customFields: nextFields });
  };

  const handleAddCustomField = () => {
    let nextKey = `field_${customFieldEntries.length + 1}`;

    while (nextKey in customFields) {
      nextKey = `${nextKey}_new`;
    }

    onChange(nodeId, {
      customFields: {
        ...customFields,
        [nextKey]: "",
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClassName} htmlFor="task-title">
          Title
        </label>
        <input
          id="task-title"
          className={inputClassName}
          type="text"
          required
          value={title}
          onChange={(event) => onChange(nodeId, { title: event.target.value })}
        />
      </div>
      <div>
        <label className={labelClassName} htmlFor="task-description">
          Description
        </label>
        <textarea
          id="task-description"
          className={`${inputClassName} min-h-[80px]`}
          value={description}
          onChange={(event) =>
            onChange(nodeId, { description: event.target.value })
          }
        />
      </div>
      <div>
        <label className={labelClassName} htmlFor="task-assignee">
          Assignee
        </label>
        <input
          id="task-assignee"
          className={inputClassName}
          type="text"
          value={assignee}
          onChange={(event) => onChange(nodeId, { assignee: event.target.value })}
        />
      </div>
      <div>
        <label className={labelClassName} htmlFor="task-due-date">
          Due Date
        </label>
        <input
          id="task-due-date"
          className={inputClassName}
          type="date"
          value={dueDate}
          onChange={(event) => onChange(nodeId, { dueDate: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={labelClassName}>Custom Fields</label>
          <button
            type="button"
            onClick={handleAddCustomField}
            className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            Add Field
          </button>
        </div>
        {customFieldEntries.length === 0 && (
          <p className="text-xs text-zinc-500">No custom fields added.</p>
        )}
        {customFieldEntries.map(([fieldKey, fieldValue]) => (
          <div key={fieldKey} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <input
              className={inputClassName}
              type="text"
              value={fieldKey}
              placeholder="Key"
              onChange={(event) =>
                handleCustomFieldChange(
                  fieldKey,
                  event.target.value,
                  fieldValue
                )
              }
            />
            <input
              className={inputClassName}
              type="text"
              value={fieldValue}
              placeholder="Value"
              onChange={(event) =>
                handleCustomFieldChange(
                  fieldKey,
                  fieldKey,
                  event.target.value
                )
              }
            />
            <button
              type="button"
              onClick={() => handleRemoveCustomField(fieldKey)}
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
