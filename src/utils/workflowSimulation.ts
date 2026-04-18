import type {
  SimulationResult,
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeByType,
} from "@/store/types";

export const getStartNodes = (
  nodes: WorkflowNode[]
): WorkflowNodeByType["start"][] =>
  nodes.filter(
    (node): node is WorkflowNodeByType["start"] => node.type === "start"
  );

export const hasStartNode = (nodes: WorkflowNode[]): boolean =>
  getStartNodes(nodes).length > 0;

const getNodeLabel = (node: WorkflowNode): string => {
  switch (node.type) {
    case "task": {
      const title = node.data.title.trim();
      return title || node.data.label || "Task";
    }
    case "approval": {
      const title = node.data.title.trim();
      return title || node.data.label || "Approval";
    }
    case "start":
      return node.data.label || "Start";
    case "end":
      return node.data.label || "End";
  }
};

export const simulateWorkflow = (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): SimulationResult => {
  const warnings = new Set<string>();

  if (nodes.length === 0) {
    warnings.add("No nodes in workflow.");
    return { steps: [], warnings: Array.from(warnings) };
  }

  const startNodes = getStartNodes(nodes);

  if (startNodes.length === 0) {
    warnings.add("Missing Start node.");
    return { steps: [], warnings: Array.from(warnings) };
  }

  if (startNodes.length > 1) {
    warnings.add("Multiple Start nodes found; using the first.");
  }

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const edgesBySource = new Map<string, WorkflowEdge[]>();

  for (const edge of edges) {
    const list = edgesBySource.get(edge.source) ?? [];
    list.push(edge);
    edgesBySource.set(edge.source, list);
  }

  const steps: string[] = [];
  const visited = new Set<string>();
  let current: WorkflowNode | undefined = startNodes[0];

  while (current) {
    if (visited.has(current.id)) {
      warnings.add(`Cycle detected at "${getNodeLabel(current)}".`);
      break;
    }

    visited.add(current.id);
    steps.push(getNodeLabel(current));

    const outgoing = edgesBySource.get(current.id) ?? [];

    if (outgoing.length === 0) {
      break;
    }

    if (outgoing.length > 1) {
      warnings.add(
        `Multiple outgoing edges from "${getNodeLabel(current)}"; using the first.`
      );
    }

    const nextEdge = outgoing[0];
    const nextNode = nodeById.get(nextEdge.target);

    if (!nextNode) {
      warnings.add(`Edge points to missing node "${nextEdge.target}".`);
      break;
    }

    current = nextNode;
  }

  const disconnected = nodes.filter((node) => !visited.has(node.id));

  if (disconnected.length > 0) {
    warnings.add(
      `Disconnected nodes: ${disconnected.map(getNodeLabel).join(", ")}.`
    );
  }

  return { steps, warnings: Array.from(warnings) };
};
