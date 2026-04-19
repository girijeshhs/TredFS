import { useEffect, useState } from "react";

import { getAutomations, type Automation } from "@/api/mock";
import type { AutomatedNodeData } from "@/store/types";
import { inputClassName, labelClassName } from "./formStyles";

type AutomatedFormProps = {
  nodeId: string;
  data: AutomatedNodeData;
  onChange: (id: string, newData: Partial<AutomatedNodeData>) => void;
};

export default function AutomatedForm({
  nodeId,
  data,
  onChange,
}: AutomatedFormProps) {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loadingAutomations, setLoadingAutomations] = useState(false);

  useEffect(() => {
    const loadAutomations = async () => {
      setLoadingAutomations(true);

      try {
        const items = await getAutomations();
        setAutomations(items);
      } finally {
        setLoadingAutomations(false);
      }
    };

    void loadAutomations();
  }, []);

  const selectedAction = automations.find(
    (automation) => automation.id === data.actionId
  );
  const paramKeys = selectedAction?.params ?? [];

  const handleActionChange = (actionId: string) => {
    const action = automations.find((automation) => automation.id === actionId);
    const params: Record<string, string> = {};

    for (const paramKey of action?.params ?? []) {
      params[paramKey] = data.params[paramKey] ?? "";
    }

    onChange(nodeId, {
      actionId,
      params,
    });
  };

  const handleParamChange = (paramKey: string, value: string) => {
    onChange(nodeId, {
      params: {
        ...data.params,
        [paramKey]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClassName} htmlFor="automated-title">
          Title
        </label>
        <input
          id="automated-title"
          className={inputClassName}
          type="text"
          value={data.title}
          onChange={(event) => onChange(nodeId, { title: event.target.value })}
        />
      </div>

      <div>
        <label className={labelClassName} htmlFor="automated-action">
          Action
        </label>
        <select
          id="automated-action"
          className={inputClassName}
          value={data.actionId}
          disabled={loadingAutomations}
          onChange={(event) => handleActionChange(event.target.value)}
        >
          <option value="">
            {loadingAutomations ? "Loading actions..." : "Select an action"}
          </option>
          {automations.map((action) => (
            <option key={action.id} value={action.id}>
              {action.label}
            </option>
          ))}
        </select>
      </div>

      {paramKeys.map((paramKey) => (
        <div key={paramKey}>
          <label className={labelClassName} htmlFor={`automated-${paramKey}`}>
            {paramKey}
          </label>
          <input
            id={`automated-${paramKey}`}
            className={inputClassName}
            type="text"
            value={data.params[paramKey] ?? ""}
            onChange={(event) => handleParamChange(paramKey, event.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
