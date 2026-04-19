import type {
  SimulationResult,
  WorkflowEdge,
  WorkflowNode,
} from "@/store/types";

export type Automation = {
  id: string;
  label: string;
  params: string[];
};

export type WorkflowSimulationPayload = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

export const getAutomations = async (): Promise<Automation[]> => {
  const response = await fetch("/api/automations", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to load automations.");
  }

  return (await response.json()) as Automation[];
};

export const simulateWorkflowAPI = async (
  workflow: WorkflowSimulationPayload
): Promise<SimulationResult> => {
  const response = await fetch("/api/simulate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workflow),
  });

  if (!response.ok) {
    return {
      steps: [],
      warnings: ["Simulation request failed."],
    };
  }

  return (await response.json()) as SimulationResult;
};