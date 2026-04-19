import type {
  SimulationResult,
  WorkflowEdge,
  WorkflowNode,
} from "@/store/types";
import { hasStartNode, simulateWorkflow } from "@/utils/workflowSimulation";

export type Automation = {
  id: string;
  label: string;
  params: string[];
};

export const getAutomations = (): Automation[] => [
  { id: "send_email", label: "Send Email", params: ["to", "subject"] },
  {
    id: "generate_doc",
    label: "Generate Document",
    params: ["template", "recipient"],
  },
];

export type WorkflowSimulationPayload = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

export const canSimulateWorkflow = (
  workflow: WorkflowSimulationPayload
): boolean => hasStartNode(workflow.nodes);

export const simulateWorkflowAPI = async (
  workflow: WorkflowSimulationPayload
): Promise<SimulationResult> => {
  // Keep async behavior to mimic a real API call.
  await new Promise((resolve) => setTimeout(resolve, 120));

  const result = simulateWorkflow(workflow.nodes, workflow.edges);

  return {
    steps: result.steps,
    warnings: result.warnings,
  };
};