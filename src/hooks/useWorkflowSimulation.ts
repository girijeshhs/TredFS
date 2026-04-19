import { useCallback, useState } from "react";

import {
  simulateWorkflowAPI,
  type WorkflowSimulationPayload,
} from "@/api/mock";
import type { SimulationResult } from "@/store/types";

const emptyResult: SimulationResult = {
  steps: [],
  warnings: [],
};

export const useWorkflowSimulation = () => {
  const [result, setResult] = useState<SimulationResult>(emptyResult);
  const [isLoading, setIsLoading] = useState(false);

  const runSimulation = useCallback(
    async (workflow: WorkflowSimulationPayload): Promise<SimulationResult> => {
      setIsLoading(true);

      try {
        const simulation = await simulateWorkflowAPI(workflow);
        setResult(simulation);
        return simulation;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    result,
    warnings: result.warnings,
    isLoading,
    runSimulation,
  };
};
