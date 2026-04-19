import { NextResponse } from "next/server";

import type { WorkflowEdge, WorkflowNode } from "@/store/types";
import { simulateWorkflow } from "@/utils/workflowSimulation";

type WorkflowPayload = {
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
};

export async function POST(request: Request) {
  try {
    const workflow = (await request.json()) as WorkflowPayload;
    const nodes = Array.isArray(workflow.nodes) ? workflow.nodes : [];
    const edges = Array.isArray(workflow.edges) ? workflow.edges : [];

    const result = simulateWorkflow(nodes, edges);

    return NextResponse.json({
      steps: result.steps,
      warnings: result.warnings,
    });
  } catch {
    return NextResponse.json(
      {
        steps: [],
        warnings: ["Invalid workflow payload."],
      },
      { status: 400 }
    );
  }
}
