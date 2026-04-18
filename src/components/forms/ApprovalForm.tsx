import type { ApprovalNodeData } from "@/store/types";
import { inputClassName, labelClassName } from "./formStyles";

type ApprovalFormProps = {
  nodeId: string;
  data: ApprovalNodeData;
  onChange: (id: string, newData: Partial<ApprovalNodeData>) => void;
};

export default function ApprovalForm({
  nodeId,
  data,
  onChange,
}: ApprovalFormProps) {
  const { title, approverRole, threshold } = data;

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClassName} htmlFor="approval-title">
          Title
        </label>
        <input
          id="approval-title"
          className={inputClassName}
          type="text"
          value={title}
          onChange={(event) => onChange(nodeId, { title: event.target.value })}
        />
      </div>
      <div>
        <label className={labelClassName} htmlFor="approval-role">
          Approver Role
        </label>
        <input
          id="approval-role"
          className={inputClassName}
          type="text"
          value={approverRole}
          onChange={(event) =>
            onChange(nodeId, { approverRole: event.target.value })
          }
        />
      </div>
      <div>
        <label className={labelClassName} htmlFor="approval-threshold">
          Threshold
        </label>
        <input
          id="approval-threshold"
          className={inputClassName}
          type="number"
          min={0}
          value={threshold}
          onChange={(event) =>
            onChange(nodeId, {
              threshold:
                event.target.value === "" ? 0 : Number(event.target.value),
            })
          }
        />
      </div>
    </div>
  );
}
