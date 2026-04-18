import type { TaskNodeData } from "@/store/types";
import { inputClassName, labelClassName } from "./formStyles";

type TaskFormProps = {
  nodeId: string;
  data: TaskNodeData;
  onChange: (id: string, newData: Partial<TaskNodeData>) => void;
};

export default function TaskForm({ nodeId, data, onChange }: TaskFormProps) {
  const title = data.title ?? "";
  const description = data.description ?? "";
  const assignee = data.assignee ?? "";

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
    </div>
  );
}
