export type NodeType = "start" | "task" | "approval" | "automated" | "end";

export type StartNodeData = {
  label: string;
};

export type TaskNodeData = {
  label: string;
  title: string;
  description: string;
  assignee: string;
};

export type ApprovalNodeData = {
  label: string;
  title: string;
  approverRole: string;
  threshold: number;
};

export type AutomatedNodeData = {
  title: string;
  actionId: string;
  params: Record<string, string>;
};

export type EndNodeData = {
  label: string;
};

export type NodeDataByType = {
  start: StartNodeData;
  task: TaskNodeData;
  approval: ApprovalNodeData;
  automated: AutomatedNodeData;
  end: EndNodeData;
};

export type WorkflowNodeData = NodeDataByType[NodeType];

export type WorkflowNodeByType = {
  [K in NodeType]: {
    id: string;
    type: K;
    position: { x: number; y: number };
    data: NodeDataByType[K];
  };
};

export type WorkflowNode = WorkflowNodeByType[NodeType];

export type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
};

export type SimulationResult = {
  steps: string[];
  warnings: string[];
};

export type WorkflowState = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode: WorkflowNode | null;
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  setSelectedNode: (node: WorkflowNode | null) => void;
  createNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (id: string, newData: Partial<WorkflowNodeData>) => void;
};
